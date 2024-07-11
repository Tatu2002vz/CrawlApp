import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";
import parse from "html-react-parser";

import formatTime from "../utils/formatTime";

const DetailBot = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [listProduct, setListProduct] = useState(null);
  useEffect(() => {
    fetch(process.env.REACT_APP_URL_SERVER + "/worker/detail/" + id, {
      method: "get",
    })
      .then((rs) => {
        return rs.json();
      })
      .then((rs) => {
        setList(rs.mes.textlog);
        setListProduct(rs.mes.product)
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="border-b p-4">
        <NavLink to={"/list-bot"}>
          <IoMdArrowRoundBack size={28} title="Go list bot" />
        </NavLink>
      </div>
      
      <div className="w-full border border-slate-400 rounded-md h-96 overflow-y-auto">
        {list?.map((item, index) => {
          return <p key={index}>{item.text}</p>;
        })}
      </div>
      <div className="grid grid-cols-12 gap-3 mt-10 border-b border-b-gray-500">
          <div className="font-bold text-center col-span-1">STT</div>
          <div className="font-bold text-center col-span-2">Tên</div>
          <div className="font-bold text-center col-span-2">Ảnh</div>
          <div className="font-bold text-center col-span-1">Giá</div>
          <div className="font-bold text-center col-span-4">Giới thiệu</div>
          <div className="font-bold text-center col-span-2">Ngày lấy tt</div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {listProduct?.map((item, index) => {
            return (
              <div
                className="grid grid-cols-12 gap-3 border-b-gray-500 border-b"
                key={index}
              >
                <div className="border-l border-l-gray-500 h-[100px] px-2 overflow-y-auto col-span-1">
                  {index + 1}
                </div>
                <div className="border-l border-l-gray-500 h-[100px] px-2 overflow-y-auto col-span-2">
                  <NavLink to={item.link}>{item.name}</NavLink>
                </div>
                <div className="border-l border-l-gray-500 h-[100px] px-2 overflow-y-auto col-span-2">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="border-l border-l-gray-500 h-[100px] px-2 overflow-y-auto col-span-1">
                  {item.price}
                </div>
                <div className="border-l border-l-gray-500 h-[100px] px-2 overflow-y-auto col-span-4">
                  {parse(item.description)}
                </div>
                <div className="border-l border-r border-r-gray-500 border-l-gray-500 h-[100px] px-2 overflow-y-auto col-span-2">
                  {formatTime(item.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
    </>
  );
};

export default DetailBot;
