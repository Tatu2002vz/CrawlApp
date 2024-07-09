import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";

const DetailBot = () => {
  const {id} = useParams()
  const [list, setList] = useState(null)
  useEffect(() => {
    fetch("http://localhost:8888/worker/detail/" + id, {
      method: "get",
    }).then((rs) => {
      return rs.json();
    }).then((rs) => {
      setList(rs.mes)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 
  return <>
  <div className="border-b p-4">
        <NavLink to={"/list-bot"}>
          <IoMdArrowRoundBack size={28} title="Go list bot" />
        </NavLink>
      </div>
  {list?.map((item, index) => {
    return <p key={index}>{item.text}</p>
  })}</>;
};

export default DetailBot;
