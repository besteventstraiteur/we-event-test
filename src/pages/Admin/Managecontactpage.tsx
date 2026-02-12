import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import { ADMIN } from "../../utils/endPoints";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../utils/http-client/axiosClient";
import CustomDatePicker from "../../components/DatePicker";
import { useToast } from "../../utils/toast";
import { useParams } from "react-router-dom";


// Quill: use the maintained fork to avoid findDOMNode issues
// npm i react-quill-new
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Prefer importing once in app root

// -------------------- Types --------------------
type Language = "en" | "es" | "fr";

interface FAQItem {
  question: string;
  answer: string;
}

interface LangContentValues {
  address: string;
  faqs: FAQItem[];
}

interface BusinessHoursRange {
  start: Date | null;
  end: Date | null;
}

interface BusinessHoursValues {
  weekdays: BusinessHoursRange;
  saturday: BusinessHoursRange;
  sundayClosed: boolean;
  sunday?: BusinessHoursRange;
}

interface ContactFormValues {
  email: string;
  phone: string;
  businessHours: BusinessHoursValues;
  en: LangContentValues;
  es: LangContentValues;
  fr: LangContentValues;
}

interface StaticPagePayload {
  slug: string;
  title: string;
  content: {
    shared: {
      email: string;
      phone: string;
      businessHours: {
        weekdays: { start: string; end: string };
        saturday: { start: string; end: string };
        sundayClosed: boolean;
        sunday?: { start: string; end: string };
      };
    };
    en: LangContentValues;
    es: LangContentValues;
    fr: LangContentValues;
  };
}

// -------------------- Utils --------------------
const toHHmm = (d: Date | null) => {
  if (!d) return "";
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

const fromHHmm = (s?: string): Date | null => {
  if (!s) return null;
  const [hh, mm] = s.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
};

// -------------------- Validation --------------------
const faqSchema = yup.object({
  question: yup.string().required("La question est requise"),
  answer: yup.string().required("La réponse est requise"),
});

const langSchema: yup.Schema<LangContentValues> = yup.object({
  address: yup.string().required("L’adresse est requise"),
  faqs: yup
    .array()
    .of(faqSchema)
    .min(1, "Au moins une FAQ est requise")
    .required("Les FAQ sont requises"),
});

const rangeObject = yup
  .object({
    start: yup
      .date()
      .typeError("L’heure de début est requise")
      .required("L’heure de début est requise"),
    end: yup
      .date()
      .typeError("L’heure de fin est requise")
      .required("L’heure de fin est requise"),
  })
  .test("end-after-start", "End time must be after start time", (val) => {
    if (!val || !val.start || !val.end) return true;
    return val.end.getTime() > val.start.getTime();
  });

const businessHoursSchema: yup.Schema<BusinessHoursValues> = yup.object({
  weekdays: rangeObject.required(),
  saturday: rangeObject.required(),
  sundayClosed: yup.boolean().required(),
  sunday: yup
    .object({
      start: yup
        .date()
        .typeError("L’heure de début est requise")
        .when("$sundayClosed", {
          is: false,
          then: (s) => s.required("L’heure de début est requise"),
          otherwise: (s) => s.notRequired(),
        }),
      end: yup
        .date()
        .typeError("L’heure de fin est requise")
        .when("$sundayClosed", {
          is: false,
          then: (s) => s.required("L’heure de fin est requise"),
          otherwise: (s) => s.notRequired(),
        }),
    })
    .nullable()
    .test(
      "end-after-start",
      "End time must be after start time",
      function (val) {
        const closed = (this.options as any).context?.sundayClosed ?? true;
        if (closed) return true;
        if (!val || !val.start || !val.end) return true;
        return val.end.getTime() > val.start.getTime();
      }
    ),
});

const schema: yup.Schema<ContactFormValues> = yup.object({
  email: yup.string().email("E-mail invalide").required("L’e-mail est requis"),
  phone: yup.string().required("Le numéro de téléphone est requis"),
  businessHours: businessHoursSchema.required(),
  en: langSchema.required(),
  es: langSchema.required(),
  fr: langSchema.required(),
});

// -------------------- Component --------------------
const ManageContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);

  const toast = useToast();
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      email: "",
      phone: "",
      businessHours: {
        weekdays: { start: fromHHmm("09:00"), end: fromHHmm("19:00") },
        saturday: { start: fromHHmm("10:00"), end: fromHHmm("17:00") },
        sundayClosed: true,
        sunday: undefined,
      },
      en: { address: "", faqs: [{ question: "", answer: "" }] },
      es: { address: "", faqs: [{ question: "", answer: "" }] },
      fr: { address: "", faqs: [{ question: "", answer: "" }] },
    },
    resolver: yupResolver(schema, { context: { sundayClosed: true } }),
    mode: "onSubmit",
  });
  
  const sundayClosed = useWatch({
    control,
    name: "businessHours.sundayClosed",
  });

  // Quill toolbar config (minimal)
  const quillModules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );
  const quillFormats = useMemo(
    () => ["bold", "italic", "underline", "list", "bullet", "link"],
    []
  );

  // Field arrays for FAQs
  const {
    fields: faqENFields,
    append: appendENFaq,
    remove: removeENFaq,
  } = useFieldArray({ control, name: "en.faqs" });
  const {
    fields: faqESFields,
    append: appendESFaq,
    remove: removeESFaq,
  } = useFieldArray({ control, name: "es.faqs" });
  const {
    fields: faqFRFields,
    append: appendFRFaq,
    remove: removeFRFaq,
  } = useFieldArray({ control, name: "fr.faqs" });

  // Fetch and normalize existing page (create vs update)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getRequest(`${ADMIN.PAGES}/${id}`);
        const data = resp?.data?.data;
        if (data?.content) {
          if (data.id) setPageId(String(data.id));

          const shared = data.content.shared ?? {
            email: data.content.en?.email ?? "",
            phone: data.content.en?.phone ?? "",
            businessHours: {
              weekdays: { start: "09:00", end: "19:00" },
              saturday: { start: "10:00", end: "17:00" },
              sundayClosed: true,
            },
          };

          const toLang = (langKey: Language): LangContentValues => {
            const src = data.content[langKey] ?? {};
            return {
              address: src.address ?? "",
              faqs:
                Array.isArray(src.faqs) && src.faqs.length > 0
                  ? src.faqs
                  : [{ question: "", answer: "" }],
            };
          };

          const bh = shared.businessHours;
          reset({
            email: shared.email ?? "",
            phone: shared.phone ?? "",
            businessHours: {
              weekdays: {
                start: fromHHmm(bh?.weekdays?.start) ?? fromHHmm("09:00"),
                end: fromHHmm(bh?.weekdays?.end) ?? fromHHmm("19:00"),
              },
              saturday: {
                start: fromHHmm(bh?.saturday?.start) ?? fromHHmm("10:00"),
                end: fromHHmm(bh?.saturday?.end) ?? fromHHmm("17:00"),
              },
              sundayClosed: !!bh?.sundayClosed,
              sunday: bh?.sunday
                ? {
                    start: fromHHmm(bh.sunday.start) ?? null,
                    end: fromHHmm(bh.sunday.end) ?? null,
                  }
                : undefined,
            },
            en: toLang("en"),
            es: toLang("es"),
            fr: toLang("fr"),
          });
        }
      } catch (err) {
        console.error("Failed to fetch content:", err);
      }
    };
    fetchData();
  }, [reset, id]);

  const buildPayload = (values: ContactFormValues): StaticPagePayload => ({
    slug: "contact-page",
    title: "Contact Page",
    content: {
      shared: {
        email: values.email,
        phone: values.phone,
        businessHours: {
          weekdays: {
            start: toHHmm(values.businessHours.weekdays.start),
            end: toHHmm(values.businessHours.weekdays.end),
          },
          saturday: {
            start: toHHmm(values.businessHours.saturday.start),
            end: toHHmm(values.businessHours.saturday.end),
          },
          sundayClosed: values.businessHours.sundayClosed,
          sunday: values.businessHours.sundayClosed
            ? undefined
            : {
                start: toHHmm(values.businessHours.sunday?.start ?? null),
                end: toHHmm(values.businessHours.sunday?.end ?? null),
              },
        },
      },
      en: values.en,
      es: values.es,
      fr: values.fr,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    try {
      const payload = buildPayload(values);

      if (pageId) {
        await patchRequest(`${ADMIN.CREATE_CONTENT}/${pageId}`, payload);
        toast.success("Contact page updated successfully");
      } else {
        await postRequest(`${ADMIN.CREATE_CONTENT}`, payload);
        toast.success("Contact page created successfully");
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-5 justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold dark:text-neutral-300">
              Gérer la page de contact
            </h1>
            <p className="text-gray-600 mt-1 dark:text-neutral-300">
              {pageId ? "Modifier le contenu existant" : "Créer du nouveau contenu"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-9">
          {/* Shared Contact */}
          <div className="bg-white dark:bg-darkmode rounded-2xl p-5">
            <h2 className="font-semibold mb-4 dark:text-neutral-300 capitalize">Contact Partagé</h2>
            <div className="space-y-4">
              <div>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputGroup
                    label="E-mail"
                    placeholder="Saisir l’adresse e-mail"
                    inputProps={field}
                    error={errors.email}
                  />
                )}
              />
              </div>

              <div>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <InputGroup
                    label="Phone Number"
                    placeholder="Saisir le numéro de téléphone"
                    inputProps={field}
                    error={errors.phone}
                  />
                )}
              />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white dark:bg-darkmode rounded-2xl p-5">
            <h2 className="font-semibold mb-4 dark:text-neutral-300 capitalize">Heures d'ouverture</h2>

            {/* Weekdays */}
            <div className="mb-4">
              <h3 className="font-semibold mb-3 dark:text-neutral-300">
                Du lundi au vendredi
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                <Controller
                  control={control}
                  name="businessHours.weekdays.start"
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-neutral-300">
                        Commencer
                      </label>
                      <CustomDatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        placeholderText="09:00"
                        className="w-full dark:border dark:border-white dark:text-neutral-300"
                      />
                      {(errors.businessHours as any)?.weekdays?.start && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            (errors.businessHours as any)?.weekdays?.start
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  )}
                />
                </div>

                <div>
                <Controller
                  control={control}
                  name="businessHours.weekdays.end"
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-neutral-300">
                       Fin
                      </label>
                      <CustomDatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        placeholderText="19:00"
                        className="w-full dark:border dark:border-white dark:text-neutral-300"
                      />
                      {(errors.businessHours as any)?.weekdays?.end && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            (errors.businessHours as any)?.weekdays?.end
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  )}
                />
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div className="mb-4">
              <h3 className="font-semibold mb-3 dark:text-neutral-300 capitalize">Samedi</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                <Controller
                  control={control}
                  name="businessHours.saturday.start"
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-neutral-300">
                        Commencer
                      </label>
                      <CustomDatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        placeholderText="10:00"
                        className="w-full dark:border dark:border-white dark:text-neutral-300"
                      />
                      {(errors.businessHours as any)?.saturday?.start && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            (errors.businessHours as any)?.saturday?.start
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  )}
                />
                </div>

                <div>
                <Controller
                  control={control}
                  name="businessHours.saturday.end"
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-neutral-300">
                        Fin
                      </label>
                      <CustomDatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        placeholderText="17:00"
                        className="w-full dark:border dark:border-white dark:text-neutral-300"
                      />
                      {(errors.businessHours as any)?.saturday?.end && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            (errors.businessHours as any)?.saturday?.end
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  )}
                />
                </div>
              </div>
            </div>

            {/* Sunday */}
            
              <div className="flex items-center gap-3 mb-3 dark:text-neutral-300">
                <Controller
                  control={control}
                  name="businessHours.sundayClosed"
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <span className="text-sm">Sunday Closed</span>
                    </label>
                  )}
                />
                {(errors.businessHours as any)?.sundayClosed && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.businessHours as any)?.sundayClosed?.message}
                  </p>
                )}
              </div>

              {!sundayClosed && (
                <div className="grid md:grid-cols-2 gap-3">
                  <Controller
                    control={control}
                    name="businessHours.sunday.start"
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Start
                        </label>
                        <CustomDatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="HH:mm"
                          placeholderText="10:00"
                        />
                        {(errors.businessHours as any)?.sunday?.start && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              (errors.businessHours as any)?.sunday?.start
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="businessHours.sunday.end"
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          End
                        </label>
                        <CustomDatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="HH:mm"
                          placeholderText="17:00"
                        />
                        {(errors.businessHours as any)?.sunday?.end && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              (errors.businessHours as any)?.sunday?.end
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}
            
          </div>

          {/* English */}

          <div className="bg-white dark:bg-darkmode rounded-2xl p-5">
            <h2 className="font-bold mb-4 dark:text-neutral-300">
              English Content (EN)
            </h2>
            <Controller
              control={control}
              name="en.address"
              render={({ field }) => (
                <InputGroup
                  label="Address (EN)"
                  placeholder="Address"
                  inputProps={field}
                  error={(errors as any).en?.address}
                />
              )}
            />
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold dark:text-neutral-300">FAQs (EN)</h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => appendENFaq({ question: "", answer: "" })}
                >
                  Add FAQ (EN)
                </Button>
              </div>
              <div className="space-y-6 mt-3">
                {faqENFields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold dark:text-neutral-300">
                        FAQ EN #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() => removeENFaq(index)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Controller
                        control={control}
                        name={`en.faqs.${index}.question`}
                        render={({ field }) => (
                          <InputGroup
                            label="Question (EN)"
                            placeholder="Enter question"
                            inputProps={field}
                            error={(errors as any).en?.faqs?.[index]?.question}
                          />
                        )}
                      />

                      {/* Quill for EN Answer */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Answer (EN)
                        </label>
                        <Controller
                          control={control}
                          name={`en.faqs.${index}.answer`}
                          render={({ field }) => (
                            <>
                              <ReactQuill
                                theme="snow"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                modules={quillModules}
                                formats={quillFormats}
                              />
                              {(errors as any).en?.faqs?.[index]?.answer && (
                                <p className="text-red-500 text-sm mt-1">
                                  {
                                    (errors as any).en?.faqs?.[index]?.answer
                                      ?.message
                                  }
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {typeof (errors as any).en?.faqs?.message === "string" && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any).en?.faqs?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Spanish */}
          <div className="bg-white dark:bg-darkmode rounded-2xl p-5">
            <h2 className="font-bold mb-4 dark:text-neutral-300">
              Spanish Content (ES)
            </h2>
            <Controller
              control={control}
              name="es.address"
              render={({ field }) => (
                <InputGroup
                  label="Address (ES)"
                  placeholder="Dirección"
                  inputProps={field}
                  error={(errors as any).es?.address}
                />
              )}
            />
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold dark:text-neutral-300">FAQs (ES)</h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => appendESFaq({ question: "", answer: "" })}
                >
                  Add FAQ (ES)
                </Button>
              </div>
              <div className="space-y-6 mt-3">
                {faqESFields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold dark:text-neutral-300">
                        FAQ ES #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() => removeESFaq(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <Controller
                        control={control}
                        name={`es.faqs.${index}.question`}
                        render={({ field }) => (
                          <InputGroup
                            label="Question (ES)"
                            placeholder="Ingrese pregunta"
                            inputProps={field}
                            error={(errors as any).es?.faqs?.[index]?.question}
                          />
                        )}
                      />

                      {/* Quill for ES Answer */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Answer (ES)
                        </label>
                        <Controller
                          control={control}
                          name={`es.faqs.${index}.answer`}
                          render={({ field }) => (
                            <>
                              <ReactQuill
                                theme="snow"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                modules={quillModules}
                                formats={quillFormats}
                              />
                              {(errors as any).es?.faqs?.[index]?.answer && (
                                <p className="text-red-500 text-sm mt-1">
                                  {
                                    (errors as any).es?.faqs?.[index]?.answer
                                      ?.message
                                  }
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {typeof (errors as any).es?.faqs?.message === "string" && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any).es?.faqs?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* French */}
          <div className="bg-white dark:bg-darkmode rounded-2xl p-5">
            <h2 className="font-bold mb-4 dark:text-neutral-300 capitalize">
              Contenu en français
            </h2>
            <Controller
              control={control}
              name="fr.address"
              render={({ field }) => (
                <InputGroup
                  label="Adresse"
                  placeholder="Adresse"
                  inputProps={field}
                  error={(errors as any).fr?.address}
                />
              )}
            />
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold dark:text-neutral-300">FAQs</h3>
                <Button
                  type="button"
                  size="small"
                  onClick={() => appendFRFaq({ question: "", answer: "" })}
                >
                 Ajouter une FAQ
                </Button>
              </div>
              <div className="space-y-6 mt-3">
                {faqFRFields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold dark:text-neutral-300 w-8 h-8 flex justify-center items-center bg-red-600 rounded-full text-white">
                        {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() => removeFRFaq(index)}
                      >
                        Supprimer
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <Controller
                        control={control}
                        name={`fr.faqs.${index}.question`}
                        render={({ field }) => (
                          <InputGroup
                            label="Question"
                            placeholder="Entrez la question"
                            inputProps={field}
                            error={(errors as any).fr?.faqs?.[index]?.question}
                          />
                        )}
                      />

                      {/* Quill for FR Answer */}
                      <div>
                        <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                          Réponse
                        </label>
                        <Controller
                          control={control}
                          name={`fr.faqs.${index}.answer`}
                          render={({ field }) => (
                            <>
                              <ReactQuill
                                theme="snow"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                modules={quillModules}
                                formats={quillFormats}
                              />
                              {(errors as any).fr?.faqs?.[index]?.answer && (
                                <p className="text-red-500 text-sm mt-1">
                                  {
                                    (errors as any).fr?.faqs?.[index]?.answer
                                      ?.message
                                  }
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {typeof (errors as any).fr?.faqs?.message === "string" && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any).fr?.faqs?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white dark:bg-darkmode rounded-2xl p-5 sticky bottom-0">
            <Button
              variant="primary"
              size="medium"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Enregistrement en cours..."
                : pageId
                ? "Enregistrer le contenu"
                : "Enregistrer le contenu"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageContactPage;
