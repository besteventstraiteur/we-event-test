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
import { AUTH } from "../../utils/endPoints";

import { BriefcaseBusiness, ChartBar, Crown, Users } from "lucide-react";


function Showcase() {
  const [imgUploading, setImgUploading] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-neutral-300">Paramètres du profil et du compte</h1>
        <p className="text-gray-600 mt-1 dark:text-neutral-300">Gérer votre compte</p>
      </div>

      <div className="w-full lg:max-w-2/3 mx-auto">       
            <div className="bg-amber-100 dark:bg-darkmode p-12 text-center rounded-2xl">
                 <div className="flex justify-center mb-5">
                    <span className="w-24 h-24 bg-white flex justify-center items-center rounded-full"><BriefcaseBusiness size={45} className="text-primary" /></span>
                 </div>
                <h1 className="text-4xl font-bold capitalize mb-3 dark:text-neutral-300">Create your professional showcase</h1>
                 <p className="text-gray-600 text-lg px-10 mb-6 dark:text-neutral-300">Join the community of elite vendors and start receiving requests from qualified clients.</p>
                 <Button variant="primary" size="large"><BriefcaseBusiness size={24} className="mr-2" />create my showcase</Button>   
            
                <div className="grid grid-cols-3 gap-4 mt-10">
                    <div className="flex flex-col items-center gap-1 text-center bg-white rounded-xl p-5">
                        <span className="w-13 h-13 bg-amber-100 flex justify-center items-center rounded-md mb-4"><Users /></span>
                        <span className="text-lg font-semibold">Targeted clients</span>
                        <p className="text-gray-600 text-sm">Receive requests from qualified clients</p>
                    </div>

                     <div className="flex flex-col items-center gap-1 text-center bg-white rounded-xl p-5">
                        <span className="w-13 h-13 bg-violet-200 flex justify-center items-center rounded-md mb-4"><ChartBar /></span>
                        <span className="text-lg font-semibold">Pro tools</span>
                        <p className="text-gray-600 text-sm">Integrated CRM, quotes, scheduling</p>
                    </div>

                     <div className="flex flex-col items-center gap-1 text-center bg-white rounded-xl p-5">
                        <span className="w-13 h-13 bg-yellow-100 flex justify-center items-center rounded-md mb-4"><Crown /></span>
                        <span className="text-lg font-semibold">Premium visibility</span>
                        <p className="text-gray-600 text-sm">Profile highlighted on the platform</p>
                    </div>

                </div>
            
            </div>

      </div>
    </div>
  );
}

export default Showcase;
