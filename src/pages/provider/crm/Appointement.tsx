import { Calendar, MapPin, Pencil, Plus, Trash, X } from "lucide-react";
import Button from "../../../components/ui/Button";
import OuterModal from "../../../components/Custommodal/OuterModal";
import { useEffect, useState } from "react";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import CustomDatePicker from "../../../components/DatePicker";

const meetingSchema = yup.object({
  title: yup.string().required("Title is required"),
  contactId: yup.string().required("Client is required"),
  location: yup.string().required("Location is required"),
  dateTime: yup.date().required("Date & time is required"),
});


const Appointment = () => {
  // Appointment modal
  const [appoinmentModal, setAppoinmentModal] = useState(false);
  const [clientValue, setClientValue] = useState("");

  const [editData, setEditData] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(meetingSchema),
    defaultValues: {
      title: "",
      contactId: "",
      location: "",
      dateTime: null,
    },
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(false);

  const fetchContacts = async () => {
    setPageLoading(true);
    try {
      const res = await getRequest(`${PROVIDER.GET_CONTACTS}?page=1&limit=100`);
      const records = res?.data?.data?.records || [];

      setContacts(
        records.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    } finally {
      setPageLoading(false);
    }
  };

  const openCreateModal = async () => {
    await fetchContacts();
    reset();
    setSelectedContact(null);
    setEditData(null);
    setAppoinmentModal(true);
  };

  /* ---------------- GET MEETINGS ---------------- */
  useEffect(() => {
    const fetchMeetings = async () => {
      setPageLoading(true);
      try {
        const res = await getRequest(`${PROVIDER.MEETING}/list`);
        setMeetings(res.data.data);
      } finally {
        setPageLoading(false);
      }
    };

    fetchMeetings();
  }, []);
  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data: any) => {
    setSubmitLoading(true);

    const payload = {
      contactId: data.contactId,
      title: data.title,
      location: data.location,
      dateTime: new Date(data.dateTime).toISOString(),
    };

    try {
      if (editData) {
        await patchRequest(`${PROVIDER.MEETING}/${editData.id}`, payload);
      } else {
        await postRequest(PROVIDER.MEETING, payload);
      }

      const res = await getRequest(`${PROVIDER.MEETING}/list`);
      setMeetings(res.data.data);

      setAppoinmentModal(false);
      reset();
      setSelectedContact(null);
      setEditData(null);
    } catch (err) {
      console.error("Submit error", err);
    }
    setSubmitLoading(false);
  };

  const handleEdit = async (item: any) => {
    await fetchContacts();

    const selected = {
      label: item.contact?.name,
      value: item.contactId,
    };

    setSelectedContact(selected);

    reset({
      title: item.title,
      contactId: item.contactId,
      location: item.location,
      dateTime: new Date(item.dateTime),
    });

    setEditData(item);
    setAppoinmentModal(true);
  };
  const handleDelete = async (id: string) => {
    setButtonLoading(true);
    try {
      await deleteRequest(`${PROVIDER.MEETING}/${id}`);
      const res = await getRequest(`${PROVIDER.MEETING}/list`);
      setMeetings(res.data.data);
      setDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error", err);
    }
    setButtonLoading(false);
  };

  const MeetingSkeleton = () => (
    <div className="bg-white dark:bg-darkmode border border-borderlight rounded-2xl p-4 animate-pulse">
      <div className="h-4 w-1/3 bg-gray-300 rounded mb-3" />
      <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
    </div>
  );

  return (
    <>
      <div className="min-h-screen">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-wider capitalize dark:text-neutral-300">
                My Meetings
              </h2>
              <p className="text-gray-600 mt-1 dark:text-neutral-300">
                Manage your sales funnels and configure your automated
                follow-ups.
              </p>
            </div>

            <Button size="medium" onClick={openCreateModal}>
              <Plus size={18} /> Schedule a meeting
            </Button>
          </div>
          {pageLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <MeetingSkeleton key={i} />
              ))}
            </div>
          ) : meetings.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-300">
              No meetings found
            </div>
          ) : (
            <>
              {meetings?.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-300">
                  No meetings found
                </div>
              ) : (
                <>
                  {meetings?.map((item) => (
                    <div className="bg-white dark:bg-darkmode border border-borderlight dark:border-black rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between gap-4 relative shadow transition-all duration-300 hover:shadow-lg">
                      <div>
                        <h4 className="text-lg font-semibold dark:text-neutral-300 capitalize">
                          {item.title}
                        </h4>
                        <div className="flex gap-2 my-2">
                          <Calendar className="text-gray-600" size={18} />
                          <div className="flex gap-1 text-gray-600 text-sm">
                            {new Date(item.dateTime).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-1 text-gray-600 text-sm">
                          <MapPin className="text-gray-600" size={18} />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 sm:items-end">
                        <span
                          className={` 
                        ${
                          item.status === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : ""
                        }
                        ${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : ""
                        }
                        text-xs px-3 py-1 rounded-full capitalize self-start sm:self-end`}
                        >
                          {item.status}
                        </span>
                        <div className="flex gap-2 mt-2">
                          <Button
                            onClick={() => handleEdit(item)}
                            loading={buttonLoading}
                          >
                            <Pencil size={16} /> Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              setDeleteTarget(item);
                              setDeleteModal(true);
                            }}
                          >
                            <Trash size={16} /> Delete
                          </Button>
                        </div>

                        {/* <span className="text-lg font-semibold dark:text-gray-600">
                      {item.price}
                    </span> */}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <OuterModal active={appoinmentModal} setActive={setAppoinmentModal}>
        <div className="w-full max-w-2xl mx-auto relative p-5 md:p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setAppoinmentModal(false);
            }}
          />

          <div className="mb-6">
            <h2 className="text-2xl font-bold dark:text-neutral-300">
              {editData ? "Edit meeting" : "New meeting"}
            </h2>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <InputGroup
                  label="Title"
                  placeholder="Ex: Follow-up Appointment"
                  error={errors.title}
                  inputProps={register("title")}
                />
              </div>

              <div>
                <Controller
                  name="contactId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      label="Client"
                      options={contacts}
                      value={selectedContact}
                      placeholder="Select client"
                      onChange={(option: any) => {
                        setSelectedContact(option);
                        field.onChange(option?.value);
                      }}
                      error={errors.contactId?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="dateTime"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label className="block mb-2 text-base font-medium">
                        Date & Time
                      </label>
                      <CustomDatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy HH:mm"
                      />
                      {errors.dateTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dateTime.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <InputGroup
                  label="Location"
                  placeholder="Location (address or Video call)"
                  error={errors.location}
                  inputProps={register("location")}
                />
              </div>

              {/* <div>
                <InputGroup
                  type="text"
                  label="Price"
                  placeholder="Appointment price (if applicable)"
                />
              </div> */}

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 justify-between mt-7">
                <Button
                  className="flex-1"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAppoinmentModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  type="submit"
                  loading={submitLoading}
                >
                  {editData ? "Update meeting" : "Create the meeting"}{" "}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </OuterModal>
      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="w-full max-w-xl mx-auto p-14 bg-white dark:bg-black rounded-2xl">
          <h3 className="text-xl font-semibold dark:text-neutral-300 text-center">
            Delete Meeting
          </h3>

          <p className="text-gray-500 dark:text-neutral-300 mt-2">
            Are you sure you want to delete:
            <strong> {deleteTarget?.title}</strong>?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button className="flex-1" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>

            <Button
              variant="danger"
              className=" text-white flex-1"
              loading={buttonLoading}
              onClick={() => {
                handleDelete(deleteTarget?.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Appointment;
