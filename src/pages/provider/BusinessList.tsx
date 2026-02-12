import { useEffect, useState } from "react";
import { Calendar, MapPin, CreditCard, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";

const BusinessList = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(4); // cards per page
  const [totalPages, setTotalPages] = useState(1);

  const fetchMeetings = async () => {
    try {
      setLoading(true);

      const res = await getRequest(
        `${PROVIDER.BUSINESS_MEETING_LIST}?page=${page}&limit=${limit}`
      );

      const data = res?.data?.data;

      setMeetings(data?.response || []);
      setTotalPages(data?.pages || 1);
    } catch (err) {
      console.error("Failed to fetch business meetings:", err);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [page]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
  };

  const registerMeeting = async (meeting) => {
    try {
      setPayingId(meeting.id);

      const res = await postRequest(PROVIDER.BUSINESS_MEETING_REGISTER, {
        meetingId: meeting.id,
      });

      const checkoutUrl = res?.data?.data?.checkoutUrl;

      if (checkoutUrl) {
        localStorage.setItem("fromBusinessMeeting", "true");
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error("Payment session failed:", err);
    } finally {
      setPayingId(null);
    }
  };

  // -------------------------
  // SKELETONS
  // -------------------------
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-7 bg-white dark:bg-darkmode rounded-2xl animate-pulse"
        >
          <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-600 rounded mb-4"></div>
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-600 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-600 rounded mb-6"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-neutral-600 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-neutral-600 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
  const isToday = (dateStr: string) => {
    const today = new Date();
    const d = new Date(dateStr);

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  return (
    <>
      {loading ? (
        renderSkeletons()
      ) : meetings.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-300">Aucune réunion professionnelle trouvée.</p>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {meetings.map((meeting) => {
            const purchased = meeting.isPurchased;
            const hasMeetingLink = Boolean(meeting.meetingUrl);

            return (
              <div
                key={meeting.id}
                className="p-7 bg-white dark:bg-darkmode rounded-2xl flex flex-col gap-5 relative"
              >
                {/* BADGES */}
                <div className="flex gap-2">
                  <span className="bg-secondary text-white rounded-full text-xs px-3 py-1 capitalize">
                    Professionnel
                  </span>
                  <span className="bg-gray-100 rounded-full text-xs px-3 py-1">
                    {meeting.amount}€
                  </span>
                </div>

                <h2 className="text-lg font-semibold dark:text-neutral-100 capitalize">
                  {meeting.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-neutral-300  line-clamp-2">
                  {meeting.description}
                </p>

                <div className="flex justify-between text-sm text-gray-600 dark:text-neutral-400">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {formatDate(meeting.startDate)}
                  </span>

                  <span className="flex items-center gap-2 capitalize">
                    <MapPin size={16} />
                    {meeting.location}
                  </span>
                </div>

                {/* BUTTON LOGIC */}
                {!purchased ? (
                  <Button
                    className="w-full mt-3"
                    loading={payingId === meeting.id}
                    onClick={() => registerMeeting(meeting)}
                  >
                    <CreditCard size={16} />
                    &nbsp; S’inscrire et payer
                  </Button>
                ) : isPast(meeting.startDate) ? (
                  <Button className="w-full mt-3 bg-gray-300" disabled>
                    Terminé
                  </Button>
                ) : isToday(meeting.startDate) ? (
                  <Button className="w-full mt-3 bg-green-600 hover:bg-green-700">
                    Aujourd’hui · Participer à {meeting.location}
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-3 bg-blue-100 text-blue-700"
                    disabled
                  >
                    Inscrit · À venir
                  </Button>
                )}
              </div>
            );
          })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10 w-full">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
               <ArrowLeft size={18} /> Précédent
              </Button>

              {/* <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span> */}

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
               Suivant <ArrowRight size={18} />
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BusinessList;
