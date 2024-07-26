import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../AppContext/AppContext";
import { auth, onAuthStateChanged } from "../firebase/firebase";

const Regsiter = () => {
  const [loading, setLoading] = useState(false);
  const { registerWithEmailAndPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Required")
      .min(4, "Must be at least 4 characters long")
      .matches(/^[a-zA-Z]+$/, "Name can only contain letters"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters long")
      .matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { name, email, password } = values;
      if (formik.isValid) {
        registerWithEmailAndPassword(name, email, password);
        setLoading(true);
      } else {
        setLoading(false);
        alert("Check your input fields");
      }
    },
  });

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 justify-items-center items-center h-screen">
          <ClipLoader color="#367fd6" size={150} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className="grid grid-cols-1 h-screen justify-items-center items-center bg-gradient-to-r from-gray-100 to-gray-200">
          <Card className="w-96 shadow-xl rounded-lg overflow-hidden">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-4 grid h-28 place-items-center bg-gradient-to-r from-blue-500 to-blue-600"
            >
              <Typography variant="h3" color="white" className="font-semibold">
                REGISTER
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-6 p-6 bg-white">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <Input
                    name="name"
                    type="text"
                    label="Name"
                    size="lg"
                    {...formik.getFieldProps("name")}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <Typography variant="small" color="red">
                      {formik.errors.name}
                    </Typography>
                  )}
                </div>
                <div className="mb-4">
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    size="lg"
                    {...formik.getFieldProps("email")}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Typography variant="small" color="red">
                      {formik.errors.email}
                    </Typography>
                  )}
                </div>
                <div className="mb-4">
                  <Input
                    name="password"
                    type="password"
                    label="Password"
                    size="lg"
                    {...formik.getFieldProps("password")}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <Typography variant="small" color="red">
                      {formik.errors.password}
                    </Typography>
                  )}
                </div>
                <Button
                  variant="gradient"
                  fullWidth
                  className="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  type="submit"
                >
                  Register
                </Button>
              </form>
            </CardBody>
            <CardFooter className="pt-0 bg-gray-50">
              <div className="mt-6 flex items-center font-roboto text-base justify-center">
                Already have an account?
                <Link to="/login">
                  <p className="ml-1 font-bold font-roboto text-sm text-blue-500 text-center hover:underline">
                    Login
                  </p>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Regsiter;