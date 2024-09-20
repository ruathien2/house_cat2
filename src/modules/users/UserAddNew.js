import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useForm } from "react-hook-form";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import { Button } from "../../components/button";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase-app/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import slugify from "slugify";
import Radio from "../../components/check-box/Radio";
import ImageUpload from "../../components/image/ImageUpload";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { userRole, userStatus } from "../../untils/constant";
import { useNavigate } from "react-router-dom";
import TextArea from "../../components/textarea/Textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const getCharacterValidationError = (string) => {
  return `Your password must have at least 1 ${string} character`;
};

const schemaValidation = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  username: yup.string().required("Please enter your username"),
  email: yup.string().email().required("Please enter your email"),
  password: yup
    .string()
    .required("Please enter a password")
    // check minimum characters
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
});

export default function UserAddNew() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      role: 3,
      status: 1,
      userName: "",
    },
    resolver: yupResolver(schemaValidation),
  });

  const navigate = useNavigate();

  const watchStatus = watch("status");
  const watchRole = watch("role");

  const handleAddPost = async (e) => {
    if (!isValid) return;
    const cloneValues = { ...e };
    cloneValues.status = Number(e.status);
    cloneValues.role = Number(e.role);
    cloneValues.userName = slugify(e.fullname || e.userName);

    try {
      const colRef = collection(db, "users");
      await addDoc(colRef, {
        ...cloneValues,
        avatar: image,
        created: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
    toast.success("Add new User successfully");
    navigate("/manage/user");
  };

  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUploadImage = (file) => {
    const storage = getStorage();

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);

        console.log("Upload is " + progress + "% done");
        console.log("progress1", progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Nothing at all");
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
        });
      }
    );
  };

  const onSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image", file.name);
    handleUploadImage(file);
  };

  const handleDeleteImage = () => {
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, "images/" + getValues("image"));

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        toast.success("Delete successfully");
        setImage("");
        setProgress(0);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const colRef = collection(db, "categories");
  //       const q = query(colRef, where("status", "==", 1));
  //       let result = [];
  //       const querySnapshot = await getDocs(q);
  //       querySnapshot.forEach((doc) => {
  //         // doc.data() is never undefined for query doc snapshots
  //         // console.log(doc.id, " => ", doc.data());
  //         result.push({
  //           id: doc.id,
  //           ...doc.data(),
  //         });
  //       });
  //       setCategories(result);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getData();
  // }, []);

  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddPost)}>
        <div className="w-full h-[200px] mx-auto rounded-full mb-10">
          <ImageUpload
            onChange={onSelectImage}
            className="!rounded-full h-full"
            handleDeleteImage={handleDeleteImage}
            // progress={progress}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              type="text"
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
              className={"input"}
            ></Input>
            <p className="errors-validation">{errors.fullname?.message}</p>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              placeholder="Enter your username"
              control={control}
              className={"input"}
            ></Input>
            <p className="errors-validation">{errors.username?.message}</p>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
              className={"input"}
            ></Input>
            <p className="errors-validation">{errors.email?.message}</p>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
              className={"input"}
            ></Input>
            <p className="errors-validation">{errors.password?.message}</p>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <div className="flex flex-wrap gap-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </div>
          </Field>
          <Field>
            <Label>Role</Label>
            <div className="flex flex-wrap gap-5">
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </div>
          </Field>
        </div>
        <Label>Description</Label>
        <TextArea
          control={control}
          name="description"
          placeholder="Enter your decription"
          className="input"
        ></TextArea>
      </form>
      <Button
        kind="primary"
        type="submit"
        className="mx-auto w-[200px]"
        // isLoading={isSubmitting}
        // disabled={isSubmitting}
      >
        Add new user
      </Button>
    </div>
  );
}
