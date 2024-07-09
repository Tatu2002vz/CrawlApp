import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import formatTime from "../utils/formatTime";
const ManageBot = () => {
  const [list, setList] = useState(null);
  useEffect(() => {
    fetch("http://localhost:8888/worker/getAll", {
      method: "get",
    })
      .then((rs) => {
        return rs.json();
      })
      .then((rs) => {
        console.log(rs);
        setList(rs.mes);
      });
  }, []);
  console.log(list);
  return (
    <>
      <div className="border-b p-4">
        <NavLink to={"/"}>
          <IoMdArrowRoundBack size={28} title="Go home" />
        </NavLink>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-10 border-b border-b-gray-500">
        <div className="font-bold text-center col-span-1">STT</div>
        <div className="font-bold text-center col-span-1">Hoàn thành lúc</div>
        <div className="font-bold text-center col-span-1">
          Trạng thái- Hiệu suất
        </div>
        <div className="font-bold text-center col-span-1">Thành công</div>
        <div className="font-bold text-center col-span-1">Thất bại</div>
        <div className="font-bold text-center col-span-6">
          Ảnh chụp lần cuối
        </div>
        <div className="font-bold text-center col-span-1">Action</div>
      </div>
      <div className="">
        {list?.map((item, index) => {
          return (
            <div
              className="grid grid-cols-12 gap-3 border-b-gray-500 border-b"
              key={index}
            >
              <div className="border-l border-l-gray-500 px-2 overflow-y-auto col-span-1">
                {index + 1}
              </div>
              <div className="border-l border-l-gray-500 px-2 overflow-y-auto col-span-1">
                {formatTime(item.createdAt)}
              </div>
              <div className="border-l border-l-gray-500 px-2 overflow-y-auto col-span-1">
                {item.active ? (
                  <span className="text-green-500 mr-1">Running</span>
                ) : (
                  <span className="text-red-500 mr-1">Stopped</span>
                )}{" "}
                - {item.speed ? +item.speed.toFixed(2) : 0} <span>products/ minute</span>
              </div>
              <div className="border-l border-l-gray-500 px-2 overflow-y-auto col-span-1">
                {item.sucess}
              </div>
              <div className="border-l border-l-gray-500 px-2 overflow-y-auto col-span-1">
                {item.failed}
              </div>
              <div className="border-l border-l-gray-500 px-2 col-span-6 grid grid-cols-3">
                {item.imageReview.map((item, index) => {
                  return (
                    <div>
                      <img
                        src={`data:image/png;base64,${item}`}
                        key={index}
                        alt="review"
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="underline text-center col-span-1 flex items-center">
                <NavLink to={`/detail-bot/${item._id}`}>Xem text log</NavLink>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ManageBot;
