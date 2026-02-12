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
import { getRequest, patchRequest } from "../../utils/http-client/axiosClient";
import { AUTH, USERS } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  phoneNumber: string | null;
  bio: string | null;
  profileImg: string | null;
};

const schema: yup.SchemaOf<ProfileForm> = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  gender: yup
    .string()
    .oneOf(["male", "female"], "Invalid gender")
    .nullable()
    .optional(),
  phoneNumber: yup
    .string()
    .nullable()
    .matches(/^(\+?[0-9\s-]{7,20})$/, {
      message: "Invalid phone number",
      excludeEmptyString: true,
    })
    .optional(),
  bio: yup
    .string()
    .nullable()
    .max(500, "Bio must be at most 500 characters")
    .optional(),
  profileImg: yup.string().nullable().optional(),
});

function Profile() {
  const [imgUploading, setImgUploading] = useState(false);
  const [active, setActive] = useState(false);

  const login = useSelector((state: any) => state.login);

  const profileData = login?.user ?? login?.user ?? login;

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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  const previewImg = watch("profileImg");

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

  const dispatch = useDispatch();
  const toast = useToast();

  const onSubmit = async (data: ProfileForm) => {
    try {
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

      toast.success("Profile updated successfully");
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, updatedData);
      dispatch(updateUserAccountAction(updatedData));

      reset(updatedUser);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile. Please try again.");
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
      console.log(updatedUser, "sdslkbdsdksjdsjkdb");
      const res = await getRequest(AUTH.GETUSERDETAILS);
      console.log(res, "sdkbsdkj");
      const updatedData = {
        ...login,
        data: {
          ...login.user,
          ...updatedUser,
          profileImg: url || null,
        },
      };

      toast.success("Profile image updated successfully");
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, updatedData);
      dispatch(updateUserAccountAction(updatedData));
      setValue("profileImg", url, { shouldDirty: true });
    } catch (err) {
      console.error(err);
      setValue("profileImg", defaultValues.profileImg ?? null, {
        shouldDirty: true,
      });
    } finally {
      setImgUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <div className="mb-6 space-y-6">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          Paramètres du profil et du compte
        </h1>
        <p className="text-gray-600 mt-1 dark:text-neutral-300">
          Gérez votre compte
        </p>
      </div>

    <div className="w-full xl:max-w-2/3 mx-auto">
        <div className="profile-image bg-white dark:bg-darkmode p-4 rounded-2xl mb-6">
          <div className="flex  sm:flex-row justify-between gap-4 items-center">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="w-full">
              <InputGroup
                label="Prénom"
                placeholder="Saisir le prénom"
                error={errors.firstName}
                inputProps={register("firstName")}
              />
            </div>
            <div className="w-full">
              <InputGroup
                label="Nom de famille"
                placeholder="Saisir le nom de famille"
                error={errors.lastName}
                inputProps={register("lastName")}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <InputGroup
              type="email"
              label="E-mail"
              placeholder="Saisir l’adresse e-mail"
              error={errors.email}
              inputProps={register("email")}
              disabled
            />

            <InputGroup
              type="tel"
              label="Numéro de téléphone"
              placeholder="+33 6 12 34 56 78"
              error={errors.phoneNumber as any}
              inputProps={register("phoneNumber")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="w-full">
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
              {errors.gender?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <InputGroup
              type="textarea"
              label="Bio"
              placeholder="Parlez-nous un peu de vous…"
              rows={5}
              error={errors.bio as any}
              inputProps={register("bio")}
            />
          </div>

          <div>
            <InputGroup
              type="text"
              label="Localisation"
              placeholder="Localisation"
              error={errors.bio as any}
              inputProps={register("bio")}
            />
          </div>

          <div>
            <InputGroup
              type="text"
              label="Nom de l’entreprise"
              placeholder="Entrez le nom de l’entreprise"
            />
          </div>

          <div>
            <InputGroup type="text" label="Site web" placeholder="Site web" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="w-full">
              <InputGroup
                type="text"
                label="LinkedIn"
                placeholder="https://www.linkedin.in/username"
                error={errors.email}
              />
            </div>

            <div className="w-full">
              <InputGroup
                type="text"
                label="Instagram"
                placeholder="@username"
              />
            </div>
          </div>

          <input type="hidden" {...register("profileImg")} />

          <div>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              className="w-full disabled:opacity-60"
              disabled={isSubmitting || imgUploading || !isDirty}
            >
              {isSubmitting ? "Saving..." : t("save")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Profile;
