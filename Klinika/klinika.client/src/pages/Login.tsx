import { SubmitHandler, useForm } from "react-hook-form";
import { schema_login } from "../features/authentication/__auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Spinner } from "@phosphor-icons/react";
import getErrorMessage from "../util/http-handler";
import { useHandler } from "../features/handata/__handata";
import {
  GlobalError,
  Input,
  Checkbox,
} from "../features/validation/__validation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
type FormFields = z.infer<typeof schema_login>;
import useAuthStore, { UserData } from "../store/AuthStore";
import { routes } from "../util/roles-routes";
import Swal from "sweetalert2";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    mode: "onChange",
    resolver: zodResolver(schema_login),
  });
  const { setGlobalError } = useHandler();
  const { setData, data } = useAuthStore();
  const { pathname } = useLocation();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    axios
      .post("/api/Auth/login", {
        Email: data.email,
        password: data.password,
      })
      .then((response) => {
        const decoded = jwtDecode(response.data);
        const userData = {
          email:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          id: decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          jwtid: decoded["JWTID"],
          role: decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
          exp: decoded["exp"],
          iss: decoded["iss"],
          aud: decoded["aud"],
        };
        setData(userData as UserData);

        const role = userData.role;
        const finalized_routing = routes[role];

        if (role === "DEVELOPER") {
          Swal.fire("Hello Developer!");
        }

        if (!pathname.includes(finalized_routing)) {
          return <Navigate to={finalized_routing} />;
        }
      })
      .catch((error) => {
        const errorMessage = getErrorMessage(error);
        setGlobalError(errorMessage);
      });
  };

  return (
    <section className="w-full h-screen flex py-24 gap-12 bg-white sm:px-12 px-4">
      <div className="w-full md:w-[50%] h-full flex justify-center items-center">
        <div className="sm:w-[400px] w-full px-4 flex flex-col gap-8 ">
          <div className="w-full sm:text-start text-center gap-4 flex flex-col">
            <h1 className="font-medium text-5xl">Login</h1>
            <span className="text-lg text-zinc-700">
              Empower your health journey with a simple click. Register now and
              prioritize your well-being today.
            </span>
          </div>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              htmlFor="email"
              labelName="Email"
              type="text"
              placeholder="Your email goes here"
              error={errors.email?.message}
              {...register("email")}
            />
            <div className="relative w-full">
              <Input
                htmlFor="password"
                labelName="Password"
                type="password"
                placeholder="Your password goes here"
                {...register("password")}
                error={errors.password?.message}
              />
              <span className="text-sm hover:text-red-500 cursor-pointer text-red-600 underline absolute right-0 top-0">
                Forgot Password?
              </span>
            </div>
            <Checkbox
              htmlFor="rememberMe"
              labelName="Remember me?"
              {...register("remember_me")}
              error={errors.remember_me?.message}
            />
            <GlobalError />
            <button
              type="submit"
              className="mt-4 py-2.5 flex justify-center items-center font-manrope hover:bg-primary/70 text-compact bg-primary/50 rounded-md active:cursor-wait"
            >
              {isSubmitting ? (
                <Spinner size={24} className="animate-spin" />
              ) : (
                "Login"
              )}
            </button>
            <span className="font-medium">
              Don&rsquo;t have an account yet?{" "}
              <Link
                to="/register"
                className="text-primary/80 hover:underline hover:text-primary focus:cursor-wait"
              >
                Register now
              </Link>
            </span>
          </form>
        </div>
      </div>
      <div className="w-[50%] max-h-fit bg-primary/50 md:block hidden rounded-md overflow-hidden"></div>
    </section>
  );
}
