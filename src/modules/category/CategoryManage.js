import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import CategoryAddNew from "./CategoryAddNew";
import Table from "../../components/table/Table";
import LabelStatus from "../../components/lable-status/LabelStatus";
import ActionView from "../../components/action/ActionView";
import ActionEdit from "../../components/action/ActionEdit";
import ActionDelete from "../../components/action/ActionDelete";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebaseConfig";
import { categoryStatus } from "../../untils/constant";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const CATEGORY_PER_PAGE = 10;

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const handeAddCategory = () => {
    navigate("/manage/add-category");
  };

  const handleDeleteCategory = async (docId) => {
    const docRef = doc(db, "categories", docId);
    await deleteDoc(docRef);
  };

  const handleLoadmore = async () => {
    // Construct a new query starting at this document,
    // get the next 25 categories.
    const next = query(
      collection(db, "categories"),
      startAfter(lastDoc || 0),
      limit(CATEGORY_PER_PAGE)
    );

    onSnapshot(next, (snapshot) => {
      const result = [];

      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setCategories([...categories, ...result]);
    });
    const documentSnapshots = await getDocs(next);

    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };

  useEffect(() => {
    const colRef = collection(db, "categories");

    onSnapshot(colRef, (snapshot) => {
      const result = [];

      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setCategories(result);
    });
  }, []);

  const searchCategory = debounce((e) => {
    setFilter(e.target.value);
  }, 5000);

  useEffect(() => {
    async function fetchData() {
      try {
        const colRef = collection(db, "categories");

        const newRef = filter
          ? query(
              colRef,
              where("name", "==", filter)
              // where("name", ">=", "end" + "utf8")
            )
          : query(colRef, limit(CATEGORY_PER_PAGE));
        const documentSnapshots = await getDocs(newRef);

        // Get the last visible document
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];

        onSnapshot(colRef, (snapshot) => {
          setTotal(snapshot.size);
        });

        onSnapshot(newRef, (snapshot) => {
          let results = [];
          snapshot.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setCategories(results);
        });
        setLastDoc(lastVisible);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [filter]);
  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <div className="flex items-end">
          <Button type="button" onClick={handeAddCategory}>
            Create new category
          </Button>
        </div>
      </DashboardHeading>
      <div className="flex justify-between mb-2">
        <input
          placeholder="Search category ..."
          className=" border-[1px] text-sm border-gray-300 rounded-lg w-full px-3 py-2 focus:border-[#2EBAC1] outline-none"
          onChange={searchCategory}
        />
      </div>
      <div className="flex justify-end"></div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id.slice(0, 5) + "..."}</td>
                  <td>{item.name}</td>
                  <td className="italic text-gray-400 ">{item.slug}</td>
                  <td>
                    {categoryStatus.APPROVED === item.status && (
                      <LabelStatus type="success">Approved</LabelStatus>
                    )}
                    {categoryStatus.UNAPPROVED === item.status && (
                      <LabelStatus type="warning">Unapproved</LabelStatus>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-x-3">
                      <ActionView></ActionView>
                      <ActionEdit
                        onClick={() =>
                          navigate(`/manage/update-category?id=${item.id}`)
                        }
                      ></ActionEdit>
                      <ActionDelete
                        onClick={() => handleDeleteCategory(item.id)}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {total > categories.length && (
        <Button type="button" kind="primary" onClick={() => handleLoadmore()}>
          Load More
        </Button>
      )}
      <span className="text-sm text-gray-300">Total: {total}</span>
    </div>
  );
};

export default CategoryManage;
