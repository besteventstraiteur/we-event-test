import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import userFallback from "../../assets/images/user-2.jpg";
import CustomSelect from "../../components/ui-main/selectBox";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadFile } from "../../utils/uploadfile";
import { setOnLocalStorage } from "../../utils/localStorage";
import { STORAGE_INDEXES } from "../../utils/constants";
import { updateUserAccountAction } from "../../module/Auth/Login/LoginActions";
import {
  getRequest,
  patchRequest,
  postRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { AUTH, PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import OuterModal from "../../components/Custommodal/OuterModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Plus, X } from "lucide-react";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  phoneNumber: string | null;
  bio: string | null;
  profileImg: string | null;
};

type BankForm = {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  swiftCode: string;
};

const profileSchema: yup.SchemaOf<ProfileForm> = yup.object({
  firstName: yup.string().trim().required("Le prénom est obligatoire"),
  lastName: yup.string().trim().required("Le nom de famille est obligatoire"),
  email: yup
    .string()
    .trim()
    .email("E-mail invalide")
    .required("L’e-mail est obligatoire"),
  gender: yup
    .string()
    .oneOf(["male", "female"], "invalide Sexe")
    .nullable()
    .optional(),
  phoneNumber: yup
    .string()
    .nullable()
    .matches(/^(\+?[0-9\s-]{7,20})$/, {
      message: "Numéro de téléphone invalide",
      excludeEmptyString: true,
    })
    .optional(),
  bio: yup
    .string()
    .nullable()
    .max(500, "La bio doit contenir au maximum 500 caractères")
    .optional(),
  profileImg: yup.string().nullable().optional(),
});

const bankSchema = yup.object({
  bankName: yup.string().required("Le nom de la banque est obligatoire"),
  accountHolderName: yup
    .string()
    .required("Le nom du titulaire du compte est obligatoire"),
  accountNumber: yup
    .string()
    .required("Le numéro de compte est obligatoire")
    .matches(/^[0-9]{8,18}$/, "Numéro de compte invalide"),
  // ifscCode: yup.string().required("IFSC code is required"),
  swiftCode: yup.string().required("Le code SWIFT est obligatoire"),
});

function Profile() {
  const [imgUploading, setImgUploading] = useState(false);
  const [active, setActive] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBank, setDeletingBank] = useState<any>(null);
  const [savingBank, setSavingBank] = useState(false);
  const [fetching, setFetching] = useState(false);

  const login = useSelector((state: any) => state.login);
  const profileData = login?.user ?? login;

  const dispatch = useDispatch();
  const toast = useToast();

  // Profile Default Values
  const defaultValues = useMemo<ProfileForm>(
    () => ({
      firstName: profileData?.firstName ?? "",
      lastName: profileData?.lastName ?? "",
      email: profileData?.email ?? "",
      gender: profileData?.gender ?? null,
      phoneNumber: profileData?.phoneNumber ?? null,
      bio: profileData?.bio ?? null,
      profileImg: profileData?.profileImg ?? null,
    }),
    [profileData],
  );

  // Profile Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm<ProfileForm>({
    resolver: yupResolver(profileSchema),
    defaultValues,
    mode: "onTouched",
  });

  const previewImg = watch("profileImg");

  // Bank Form
  const {
    register: registerBank,
    handleSubmit: handleSubmitBank,
    reset: resetBank,
    formState: { errors: bankErrors },
  } = useForm<BankForm>({
    resolver: yupResolver(bankSchema),
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      swiftCode: "",
    },
  });

  // Fetch banks
  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const res = await getRequest(PROVIDER.GET_BANKS);
      if (res?.data?.success) {
        setBanks(res.data.data.banks || []);
      }
    } catch (err) {
      console.error("Failed to load banks", err);
      toast.error("Échec du chargement des banques");
    } finally {
      setLoadingBanks(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active]);

  const options = [
    { value: "male", label: "Homme" },
    { value: "female", label: "Femme" },
  ];

  const onSubmit = async (data: ProfileForm) => {
    try {
      setFetching(true);
      await patchRequest(`${AUTH.UPDATE_PROFILE}`, data);
      const getUserData = await getRequest(`${AUTH.GETUSERDETAILS}`);
      const updatedUser = getUserData?.data?.data;

      const updatedData = {
        ...login,
        data: {
          ...login.user,
          ...updatedUser,
        },
      };

      toast.success("Profil mis à jour avec succès");
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, updatedData);
      dispatch(updateUserAccountAction(updatedData));
      const cleanProfileValues: ProfileForm = {
        firstName: updatedUser.firstName ?? "",
        lastName: updatedUser.lastName ?? "",
        email: updatedUser.email ?? "",
        gender: updatedUser.gender ?? null,
        phoneNumber: updatedUser.phoneNumber ?? null,
        bio: updatedUser.bio ?? null,
        profileImg: updatedUser.profileImg ?? null,
      };

      reset(cleanProfileValues);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Échec de la mise à jour du profil");
    } finally {
      setFetching(false);
    }
  };

  const onChangeProfileImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImgUploading(true);
      const localPreview = URL.createObjectURL(file);
      setValue("profileImg", localPreview, { shouldDirty: true });
      const { url } = await uploadFile(file);
      const data = { profileImg: url };
      await patchRequest(`${AUTH.UPDATE_PROFILE}`, data);
      const getUserData = await getRequest(`${AUTH.GETUSERDETAILS}`);
      const updatedUser = getUserData?.data?.data;

      const updatedData = {
        ...login,
        data: {
          ...login.user,
          ...updatedUser,
          profileImg: url || null,
        },
      };
      toast.success("Image de profil mise à jour avec succès");
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, updatedData);
      dispatch(updateUserAccountAction(updatedData));
      setValue("profileImg", url, { shouldDirty: true });
    } catch (err) {
      console.error(err);
      toast.error("Échec du téléchargement de l’image");
    } finally {
      setImgUploading(false);
      e.target.value = "";
    }
  };

  const handleAddOrEditBank = async (data: BankForm) => {
    try {
      setSavingBank(true);
      if (selectedBank) {
        await patchRequest(`${PROVIDER.GET_BANKS}/${selectedBank.id}`, {
          userId: login?.user?.id,
          ...data,
        });
        toast.success("Bank updated successfully");
      } else {
        await postRequest(PROVIDER.GET_BANKS, {
          userId: login?.user?.id,
          ...data,
        });
        toast.success("Bank added successfully");
      }
      setShowBankModal(false);
      resetBank();
      setSelectedBank(null);
      fetchBanks();
    } catch (err) {
      console.error("Bank save error:", err);
      toast.error("Failed to save bank");
    } finally {
      setSavingBank(false);
    }
  };

  const handleDeleteBank = async () => {
    setDeleteLoading(true);
    try {
      if (!deletingBank) return;
      await deleteRequest(`${PROVIDER.GET_BANKS}/${deletingBank.id}`);
      toast.success("Bank Supprimé avec succès");
      setShowDeleteModal(false);
      setDeletingBank(null);
      fetchBanks();
    } catch (err) {
      console.error("Delete bank error:", err);
      toast.error("Failed to delete bank");
    }
    setDeleteLoading(false);
  };

  const openAddBank = () => {
    setSelectedBank(null);
    resetBank();
    setShowBankModal(true);
  };

  const openEditBank = (bank: any) => {
    setSelectedBank(bank);
    resetBank(bank);
    setShowBankModal(true);
  };

  useEffect(() => {
    if (!showBankModal) {
      setSelectedBank(null);
      resetBank({
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        swiftCode: "",
      });
    }
  }, [showBankModal, resetBank]);

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 capitalize mb-0">
          Paramètres du profil et du compte
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Gérez votre compte
        </p>
      </div>

      {/* Profile Section */}
     <div className="w-full xl:max-w-2/3 mx-auto">
        <div className="profile-image bg-white dark:bg-darkmode p-4 rounded-2xl mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="flex gap-3 items-center">
              <img
                src={previewImg || userFallback}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-medium dark:text-neutral-300">
                  {(profileData?.firstName || "") +
                    " " +
                    (profileData?.lastName || "")}
                </span>
                <span className="text-sm text-gray-500 dark:text-neutral-300">
                  {profileData?.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="medium" disabled={imgUploading}>
                <label
                  htmlFor="profileimg"
                  className="relative inline-flex items-center"
                  role="button"
                >
                  <input
                    id="profileimg"
                    type="file"
                    accept="image/*"
                    onChange={onChangeProfileImage}
                    className="hidden"
                  />
                  {imgUploading
                    ? "Téléchargement en cours..."
                    : "Changer l'image de profil"}
                </label>
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl mb-6"
        >
          <div>
            <InputGroup
              label="Prénom"
              placeholder="Saisir le prénom"
              error={errors.firstName}
              inputProps={register("firstName")}
            />
          </div>

          <div>
            <InputGroup
              label="Nom de famille"
              placeholder="Saisir le nom de famille"
              error={errors.lastName}
              inputProps={register("lastName")}
            />
          </div>

          <div>
            <InputGroup
              type="email"
              label="E-mail"
              placeholder="Saisir l’adresse e-mail"
              error={errors.email}
              inputProps={register("email")}
            />
          </div>

          <div>
            <CustomSelect
              label="Sexe"
              value={
                options.find((opt) => opt.value === watch("gender")) || null
              }
              onChange={(opt: any) =>
                setValue("gender", opt?.value ?? null, { shouldDirty: true })
              }
              options={options}
              placeholder="Sélectionnez le sexe"
            />
          </div>

          <div>
            <InputGroup
              type="tel"
              label="Numéro de téléphone"
              placeholder="+33 6 12 34 56 78"
              error={errors.phoneNumber as any}
              inputProps={register("phoneNumber")}
            />
          </div>

          <div>
            <InputGroup
              type="textarea"
              label="Bio"
              placeholder="Parlez-nous un peu de vous..."
              rows={5}
              error={errors.bio as any}
              inputProps={register("bio")}
            />
            <input type="hidden" {...register("profileImg")} />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting || imgUploading || !isDirty}
          >
            {isSubmitting ? "Enregistrement en cours..." : "Enregistrer"}
          </Button>
        </form>

        {/* ========================= */}
        {/* BANK ACCOUNTS SECTION */}
        {/* ========================= */}

        {profileData?.role === "partner" && (
          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-neutral-100">
                Comptes bancaires
              </h2>
              <Button variant="outline" onClick={openAddBank}>
                <Plus size={18} /> Ajouter une banque
              </Button>
            </div>

            {loadingBanks ? (
              <Skeleton count={3} height={60} className="rounded-lg mb-2" />
            ) : banks.length === 0 ? (
              <p className="text-gray-500 dark:text-neutral-300 text-sm">
                Aucun compte bancaire n'a encore été ajouté.
              </p>
            ) : (
              <div className="space-y-3">
                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    className="border border-borderlight dark:border-gray-700 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
                  >
                    <div>
                      <p className="font-semibold dark:text-neutral-300">
                        {bank.bankName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {bank.accountHolderName} — {bank.accountNumber}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 mt-2 sm:mt-0">
                      <Button
                        className="flex-1"
                        variant="primary"
                        onClick={() => openEditBank(bank)}
                      >
                        Modifier
                      </Button>
                      <Button
                        className="flex-1"
                        variant="danger"
                        onClick={() => {
                          setDeletingBank(bank);
                          setShowDeleteModal(true);
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <OuterModal active={showBankModal} setActive={setShowBankModal}>
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-lg mt-10 relative">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold  dark:text-neutral-100 mb-0">
              {selectedBank
                ? "Modifier les coordonnées bancaires"
                : "Ajouter les coordonnées bancaires"}
            </h2>
          </div>

          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setShowBankModal(false)}
          />

          <form
            onSubmit={handleSubmitBank(handleAddOrEditBank)}
            className="space-y-3"
          >
            <div>
              <InputGroup
                label="Nom de la banque"
                placeholder="Saisir le nom de la banque"
                error={bankErrors.bankName}
                inputProps={registerBank("bankName")}
              />
            </div>

            <div>
              <InputGroup
                label="Nom du titulaire du compte"
                placeholder="Saisir le nom du titulaire du compte"
                error={bankErrors.accountHolderName}
                inputProps={registerBank("accountHolderName")}
              />
            </div>

            <div>
              <InputGroup
                label="Numéro de compte"
                placeholder="Saisir le numéro de compte"
                error={bankErrors.accountNumber}
                inputProps={registerBank("accountNumber")}
              />
            </div>

            <div>
              <InputGroup
                label="Code"
                placeholder="Saisir le code"
                error={bankErrors.swiftCode}
                inputProps={registerBank("swiftCode")}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowBankModal(false)}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" loading={savingBank}>
                {selectedBank ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>

      <OuterModal active={showDeleteModal} setActive={setShowDeleteModal}>
        <div className="max-w-xl mx-auto bg-white dark:bg-[#1E1E1E] p-5 md:p-8 rounded-xl shadow-lg mt-10 text-center">
          <div className="mb-6 space-y-3">
            <h2 className="text-2xl font-semibold mb-0 dark:text-neutral-100">
              Confirmer la suppression
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Êtes-vous sûr de vouloir supprimer ce compte (
              {deletingBank?.bankName})?
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-3 mt-10">
            <Button
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              loading={deleteLoading}
              variant="danger"
              onClick={handleDeleteBank}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
}

export default Profile;
