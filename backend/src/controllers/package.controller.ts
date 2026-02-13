import { Request, Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/auth.middleware';

// Get all packages with filtering
export const getPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '12',
      categoryId,
      minPrice,
      maxPrice,
      businessId,
      search,
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (businessId) {
      where.businessId = businessId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        skip,
        take,
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
              logo: true,
              city: true,
              averageRating: true,
              totalReviews: true,
              verified: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.package.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        packages,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / take),
        },
      },
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
    });
  }
};

// Get package by ID
export const getPackageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const packageData = await prisma.package.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            description: true,
            logo: true,
            coverImage: true,
            city: true,
            country: true,
            address: true,
            phone: true,
            email: true,
            website: true,
            averageRating: true,
            totalReviews: true,
            verified: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!packageData) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { package: packageData },
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package',
    });
  }
};

// Get provider packages
export const getProviderPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;

    const packages = await prisma.package.findMany({
      where: {
        businessId,
        isActive: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: { packages },
    });
  } catch (error) {
    console.error('Get provider packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider packages',
    });
  }
};

// Create package (Provider only)
export const createPackage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get provider's business profile
    const business = await prisma.businessProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!business) {
      res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
      return;
    }

    const {
      name,
      description,
      price,
      discountPrice,
      categoryId,
      duration,
      minCapacity,
      maxCapacity,
      included,
      excluded,
      images,
      isActive,
      isFeatured,
    } = req.body;

    const packageData = await prisma.package.create({
      data: {
        businessId: business.id,
        name,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        categoryId,
        duration,
        minCapacity,
        maxCapacity,
        included,
        excluded,
        images,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: { package: packageData },
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create package',
    });
  }
};

// Update package
export const updatePackage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify ownership
    const business = await prisma.businessProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!business) {
      res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
      return;
    }

    const existingPackage = await prisma.package.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    if (existingPackage.businessId !== business.id && req.user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to update this package',
      });
      return;
    }

    const {
      name,
      description,
      price,
      discountPrice,
      categoryId,
      duration,
      minCapacity,
      maxCapacity,
      included,
      excluded,
      images,
      isActive,
      isFeatured,
    } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (discountPrice !== undefined)
      updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (duration !== undefined) updateData.duration = duration;
    if (minCapacity !== undefined) updateData.minCapacity = minCapacity;
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
    if (included !== undefined) updateData.included = included;
    if (excluded !== undefined) updateData.excluded = excluded;
    if (images !== undefined) updateData.images = images;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const packageData = await prisma.package.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: { package: packageData },
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package',
    });
  }
};

// Delete package
export const deletePackage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify ownership
    const business = await prisma.businessProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!business) {
      res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
      return;
    }

    const existingPackage = await prisma.package.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    if (existingPackage.businessId !== business.id && req.user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this package',
      });
      return;
    }

    // Soft delete by setting isActive to false
    await prisma.package.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete package',
    });
  }
};
