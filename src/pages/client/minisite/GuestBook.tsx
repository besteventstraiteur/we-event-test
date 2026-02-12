import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Quote } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../../utils/toast";
import { getRequest } from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import InputGroup from "../../../components/ui-main/InputGroup";
import Button from "../../../components/ui/Button";

const GuestBook = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const schema = yup.object().shape({
    name: yup.string().required("Your name is required"),
    message: yup.string().required("Message cannot be empty"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getRequest(`${PROVIDER.GUEST_MESSAGES}?eventId=${id}`);
      setMessages(res?.data?.data?.messages || []);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMessages();
  }, [id]);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      // await getRequest(`${PROVIDER.ADD_GUEST_MESSAGE}`, {
      //   method: "POST",
      //   data: { eventId: Number(id), ...values },
      // });
      toast.success("Your message has been added ");
      reset();
      fetchMessages();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-20">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <div className="flex flex-col items-center mb-10">
          <Heart size={40} className="text-pink-500 mb-2" />
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Wedding Guest Book
          </h1>
          <p className="text-gray-500 text-lg">
            Discover the messages left by your guests.
          </p>
        </div>

        {/* Form */}
        {/* <div className="bg-white shadow-lg rounded-2xl p-6 mb-12 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Heart size={18} className="text-pink-500" />
            <h2 className="font-semibold text-gray-800 text-lg">
              Leave a message for the new leeds
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 text-left"
          >
            <InputGroup
              type="text"
              placeholder="Your name"
              inputProps={register("name")}
              error={errors.name}
            />
            <InputGroup
              type="textarea"
              placeholder="Your message..."
              inputProps={register("message")}
              error={errors.message}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                size="medium"
                disabled={isSubmitting}
                className="!rounded-lg"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </div> */}

        <div className="bg-white shadow-sm rounded-2xl p-10">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={80} borderRadius={10} />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              <Quote size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-lg">
                No messages yet. Be the first to leave one!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="border border-gray-100 rounded-xl p-6 text-left hover:shadow transition-all bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {msg.name}
                  </h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(msg.createdAt).toLocaleDateString()} •{" "}
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestBook;
