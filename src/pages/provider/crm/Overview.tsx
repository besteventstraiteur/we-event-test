import { useState } from "react";
import {
  ChartBar,
  ChartPie,
  Download,
  File,
  FileStack,
  Filter,
  Funnel,
  FunnelPlus,
  Mail,
  Phone,
  RefreshCcw,
  Sparkle,
  SparklesIcon,
  X,
  Zap,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Staticscard from "../Sales/Statics-card";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import OuterModal from "../../../components/Custommodal/OuterModal";
import { useNavigate } from "react-router-dom";
import Globaltabs from "../Sales/Globaltabs";

const duration = [
  { value: "6 months", label: "6 months" },
  { value: "3 months", label: "3 months" },
  { value: "1 month", label: "1 month" },
];

const CrmOverview = () => {
  const [durationValue, setDurationValue] = useState("");
  return (
    <>
      <div className="min-h-screen">
        <div className="mb-6">
          <div className="flex flex-col items-start md:flex-row md:items-center gap-5 justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold dark:text-neutral-300">
                Scoring des Leads
              </h1>
              <p className="text-gray-600 mt-1 dark:text-neutral-300">
                Manage all your business documents: quotes, invoices, purchase
                orders and delivery notes
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-wider capitalize dark:text-neutral-300">
                CRM - Overview
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Staticscard
              heading="Total Contacts"
              value={3}
              subheading=""
              bgcolor="bg-blue-100"
              icon={<Funnel size={20} />}
              iconcolor="text-blue-500"
            />

            <Staticscard
              heading="Active Opportunities"
              value={2}
              subheading=""
              bgcolor="bg-green-100"
              icon={<FunnelPlus size={20} />}
              iconcolor="text-green-500"
            />

            <Staticscard
              heading="Pipeline Value"
              value="15500€"
              subheading=""
              bgcolor="bg-orange-100"
              icon={<FunnelPlus size={20} />}
              iconcolor="text-orange-500"
            />

            <Staticscard
              heading="Conversion Rate"
              value="33.33%"
              subheading=""
              bgcolor="bg-purple-100"
              icon={<Funnel size={20} />}
              iconcolor="text-purple-500"
            />
          </div>

          <div className="mt-6">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex gap-3 justify-between shadow-sm rounded-t-lg">
              <div className="flex gap-3">
                <span className="bg-white/30 w-10 h-10 rounded-lg flex justify-center items-center">
                  <ChartBar className="shrink-0" />
                </span>
                <div className="flex flex-col gap-1">
                  <div className="text-xl text-white">Visual Dashboard</div>
                  <p className="text-sm">
                    Intelligent visualizations of your CRM data
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <CustomSelect
                    options={duration}
                    value={durationValue}
                    onChange={setDurationValue}
                    placeholder="All ranks"
                    className="w-full min-w-60 !bg-white/30 !border-0"
                  />
                </div>
                <Button className="!bg-white !text-blue-700">
                  <Sparkle size={18} />
                  Generate the graphs
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-b-lg">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 bg-green-100 text-green-800 rounded-lg p-4">
                      <span>conversion tax</span>
                      <span className="text-2xl font-bold">17%</span>
                    </div>

                    <div className="flex flex-col gap-2 bg-blue-100 text-blue-800 rounded-lg p-4">
                      <span>Panier moyen</span>
                      <span className="text-2xl font-bold">1500 €</span>
                    </div>

                    <div className="flex flex-col gap-2 bg-purple-100 text-purple-800 rounded-lg p-4">
                      <span>Delai conversion</span>
                      <span className="text-2xl font-bold">30 Jours</span>
                    </div>

                    <div className="flex flex-col gap-2 bg-amber-100 text-amber-800 rounded-lg p-4">
                      <span>Meilleure source</span>
                      <span className="text-2xl font-bold">Direct</span>
                    </div>
                  </div>

                  <div className="bg-blue-100 p-4 rounded-lg flex gap-2">
                    <SparklesIcon className="shrink-0" size={18} />
                    <p className="text-gray-600 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Rem aliquid minima, odit officia blanditiis, numquam
                      beatae quas vel cupiditate voluptatem nulla? Reprehenderit
                      numquam eos illo voluptates ut expedita modi placeat?
                    </p>
                  </div>

                  <Globaltabs
                    tabs={[
                      {
                        label: "Evolution",
                        content: (
                          <>
                            <div className="border border-gray-200 p-4 rounded-lg">
                              <p>Show map here</p>
                              <div className="flex gap-2 justify-between mt-4">
                                <Button variant="outline">
                                  {" "}
                                  <RefreshCcw size={18} /> Update
                                </Button>
                                <Button variant="outline">
                                  {" "}
                                  <Download size={18} /> Export Pdf
                                </Button>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        label: "Sources",
                        content: (
                          <>
                            <div className="border border-gray-200 p-4 rounded-lg">
                              <p>Show map here</p>
                              <div className="flex gap-2 justify-between mt-4">
                                <Button variant="outline">
                                  {" "}
                                  <RefreshCcw size={18} /> Update
                                </Button>
                                <Button variant="outline">
                                  {" "}
                                  <Download size={18} /> Export Pdf
                                </Button>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        label: "Opportunites",
                        content: (
                          <>
                            <div className="border border-gray-200 p-4 rounded-lg">
                              <p>Show map here</p>
                              <div className="flex gap-2 justify-between mt-4">
                                <Button variant="outline">
                                  {" "}
                                  <RefreshCcw size={18} /> Update
                                </Button>
                                <Button variant="outline">
                                  {" "}
                                  <Download size={18} /> Export Pdf
                                </Button>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        label: "CA",
                        content: (
                          <>
                            <div className="border border-gray-200 p-4 rounded-lg">
                              <p>Show map here</p>
                              <div className="flex gap-2 justify-between mt-4">
                                <Button variant="outline">
                                  {" "}
                                  <RefreshCcw size={18} /> Update
                                </Button>
                                <Button variant="outline">
                                  {" "}
                                  <Download size={18} /> Export Pdf
                                </Button>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        label: "Funnel",
                        content: (
                          <>
                            <div className="border border-gray-200 p-4 rounded-lg">
                              <p>Show map here</p>
                              <div className="flex gap-2 justify-between mt-4">
                                <Button variant="outline">
                                  {" "}
                                  <RefreshCcw size={18} /> Update
                                </Button>
                                <Button variant="outline">
                                  {" "}
                                  <Download size={18} /> Export Pdf
                                </Button>
                              </div>
                            </div>
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="p-24">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-200  flex items-center justify-center">
                  <ChartPie size={40} className="text-blue-800" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">View your CRM data</h2>
                  <p className="text-sm text-gray-600 my-5 max-w-md mx-auto">
                    AI analyzes your contacts and opportunities to generate
                    relevant graphs and help you make better decisions.
                  </p>
                  <Button>
                    <Sparkle size={18} />
                    Generate the graphs
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex gap-3 justify-between shadow-sm rounded-t-lg">
              <div className="flex gap-3">
                <span className="bg-white/30 w-10 h-10 rounded-lg flex justify-center items-center">
                  <ChartBar className="shrink-0" />
                </span>
                <div className="flex flex-col gap-1">
                  <div className="text-xl text-white">AI CRM Assistant</div>
                  <p className="text-sm">
                    Smart recommendations to optimize your prospecting
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="!bg-white !text-blue-700">
                  <Sparkle size={18} />
                  Analyze my CRM
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-b-lg">
              <div className="p-4">
                <Globaltabs
                  tabs={[
                    {
                      label: `Prospects (${5})`,
                      content: (
                        <>
                          <div className="space-y-4">
                            <div className="flex justify-between gap-3">
                              <h2 className="text-xl font-semibold">
                                Prospects Prioritaries a contacter
                              </h2>
                              <button className="flex items-center gap-1">
                                <RefreshCcw size={16} />
                                Update
                              </button>
                            </div>
                            <div className="border border-gray-200 p-4 relative rounded-lg">
                              <h3 className="text-xl capitalize font-semibold">
                                Sophie Martin
                              </h3>
                              <p className="text-gray-600 text-sm">
                                Evenements Premium
                              </p>
                              <div className="mt-4 mb-3">
                                <p className="text-gray-600">
                                  Evaluation d'un evenement majeur prevu dans 2
                                  mois
                                </p>
                              </div>
                              <div className="flex gap-3">
                                <button className="border border-gray-200 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-100">
                                  Call to discuss your needs
                                </button>
                                <button className="border border-gray-200 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-100">
                                  Send an email presentation
                                </button>
                                <button className="border border-gray-200 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-100">
                                  Schedule a meeting
                                </button>
                              </div>
                              <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full absolute top-4 right-4">
                                High priority
                              </span>
                            </div>
                          </div>
                        </>
                      ),
                    },
                    {
                      label: `Suivis (${5})`,
                      content: (
                        <>
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-xl font-semibold">
                                Recommended follow-up actions
                              </h2>
                            </div>
                            <div className="border border-gray-200 p-4 relative rounded-lg bg-blue-100">
                              <div className="flex gap-2 items-start">
                                <span className="w-10 h-10 shrink-0 rounded-full flex justify-center items-center bg-red-100">
                                  <Phone size={18} />
                                </span>
                                <div className="flex flex-col ">
                                  <div className="flex gap-2">
                                    <h3 className="text-lg capitalize font-semibold">
                                      Pierre Moreau
                                    </h3>
                                    <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                                      High priority
                                    </span>
                                  </div>
                                  <p className="text-gray-600">
                                    Relancer sur une proposition de partenariat
                                    discutee
                                  </p>
                                  <div className="mt-4 mb-3">
                                    <p className="text-gray-600 text-sm">
                                      Aucun retour apres 2 semaines, suivre pour
                                      maintenir interet
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-5 text-end">
                                <Button>Exécuter</Button>
                              </div>
                            </div>

                            <div className="border border-gray-200 p-4 relative rounded-lg bg-blue-100">
                              <div className="flex gap-2 items-start">
                                <span className="w-10 h-10 shrink-0 rounded-full flex justify-center items-center bg-yellow-100">
                                  <Mail size={18} />
                                </span>
                                <div className="flex flex-col ">
                                  <div className="flex gap-2">
                                    <h3 className="text-lg capitalize font-semibold">
                                      Anais Petit
                                    </h3>
                                  </div>
                                  <p className="text-gray-600">
                                    Envoyer des informations sur nos services
                                    apres reunion precedente
                                  </p>
                                  <div className="mt-4 mb-3">
                                    <p className="text-gray-600 text-sm">
                                      Aucun retour apres 2 semaines, suivre pour
                                      maintenir interet
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-5 text-end">
                                <Button>Exécuter</Button>
                              </div>
                            </div>
                          </div>
                        </>
                      ),
                    },
                    {
                      label: `Segments (${5})`,
                      content: (
                        <>
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-xl font-semibold">
                                Segments pour campagnes ciblees
                              </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                              <div className="border border-gray-200 p-6 rounded-2xl">
                                <div className="flex gap-3 justify-between">
                                  <h3 className="text-lg font-semibold">
                                    Partenaires Actuels
                                  </h3>
                                  <span className="border border-gray-200 text-sm rounded-full px-3 py-1">
                                    15 contacts
                                  </span>
                                </div>
                                <p className="text-gray-600">
                                  Contacts avec qui nous avons deja collabore
                                  pour des evenements
                                </p>

                                <div className="flex justify-between gap-3 mt-5">
                                  <Button variant="outline" className="flex-1">
                                    <Mail size={18} />
                                    Campagne Email
                                  </Button>
                                  <Button className="flex-1">
                                    <Funnel size={18} /> Vior Contacts
                                  </Button>
                                </div>
                              </div>

                              <div className="border border-gray-200 p-6 rounded-2xl">
                                <div className="flex gap-3 justify-between">
                                  <h3 className="text-lg font-semibold">
                                    Partenaires Actuels
                                  </h3>
                                  <span className="border border-gray-200 text-sm rounded-full px-3 py-1">
                                    15 contacts
                                  </span>
                                </div>
                                <p className="text-gray-600">
                                  Contacts avec qui nous avons deja collabore
                                  pour des evenements
                                </p>

                                <div className="flex justify-between gap-3 mt-5">
                                  <Button variant="outline" className="flex-1">
                                    <Mail size={18} />
                                    Campagne Email
                                  </Button>
                                  <Button className="flex-1">
                                    <Funnel size={18} /> Vior Contacts
                                  </Button>
                                </div>
                              </div>

                              <div className="border border-gray-200 p-6 rounded-2xl">
                                <div className="flex gap-3 justify-between">
                                  <h3 className="text-lg font-semibold">
                                    Partenaires Actuels
                                  </h3>
                                  <span className="border border-gray-200 text-sm rounded-full px-3 py-1">
                                    15 contacts
                                  </span>
                                </div>
                                <p className="text-gray-600">
                                  Contacts avec qui nous avons deja collabore
                                  pour des evenements
                                </p>

                                <div className="flex justify-between gap-3 mt-5">
                                  <Button variant="outline" className="flex-1">
                                    <Mail size={18} />
                                    Campagne Email
                                  </Button>
                                  <Button className="flex-1">
                                    <Funnel size={18} /> Vior Contacts
                                  </Button>
                                </div>
                              </div>

                              <div className="border border-gray-200 p-6 rounded-2xl">
                                <div className="flex gap-3 justify-between">
                                  <h3 className="text-lg font-semibold">
                                    Partenaires Actuels
                                  </h3>
                                  <span className="border border-gray-200 text-sm rounded-full px-3 py-1">
                                    15 contacts
                                  </span>
                                </div>
                                <p className="text-gray-600">
                                  Contacts avec qui nous avons deja collabore
                                  pour des evenements
                                </p>

                                <div className="flex justify-between gap-3 mt-5">
                                  <Button variant="outline" className="flex-1">
                                    <Mail size={18} />
                                    Campagne Email
                                  </Button>
                                  <Button className="flex-1">
                                    <Funnel size={18} /> Vior Contacts
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ),
                    },
                  ]}
                />
              </div>

              <div className="p-24">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-200  flex items-center justify-center">
                  <ChartPie size={40} className="text-blue-800" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">
                    Discover your best prospects
                  </h2>
                  <p className="text-sm text-gray-600 my-5 max-w-md mx-auto">
                    AI analyzes your contacts and opportunities to identify
                    prospects to contact as a priority and suggest personalized
                    actions.
                  </p>
                  <Button>
                    <Sparkle size={18} />
                    Launch AI Analysis
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Recent Contacts
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">Marie Dupont</p>
                      <p className="text-sm text-gray-600">Tech Corp</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      prospect
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200  rounded-lg">
                    <div>
                      <p className="font-semibold">Jean Martin</p>
                      <p className="text-sm text-gray-600">Design Studio</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      customer
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200  rounded-lg">
                    <div>
                      <p className="font-semibold">Sophie Bernard</p>
                      <p className="text-sm text-gray-600">StartUp Inc</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      prospect
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Current Opportunities
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">Dupont's Wedding</p>
                      <p className="text-sm text-gray-600">€ 5,000</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      proposal
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">Bernard Event</p>
                      <p className="text-sm text-gray-600">€ 8,000</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      negotiation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrmOverview;
