import { io } from "socket.io-client";
import { useEffect, useMemo, useRef, useState } from "react";
import parse from "html-react-parser";
import { NavLink } from "react-router-dom";
import formatTime from "../utils/formatTime";
import { toast } from "react-toastify";
const Home = () => {
  const [product, setProduct] = useState([]);
  const [textlog, setTextlog] = useState([]);
  const [image, setImage] = useState();
  const [success, setSuccess] = useState(0);
  const [error, setError] = useState(0);
  const [id, setId] = useState("");
  const workerId = useRef("");
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_URL_SERVER);
  }, []);
  // const id = useRef(uuidv4());
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
      setId(socket.id);
      socket.on(`textlog`, (payload) => {
        setTextlog((prev) => {
          return [...prev, payload];
        });
      });
      socket.on(`product`, (payload) => {
        setProduct((prev) => {
          return [...prev, payload];
        });
      });
      socket.on(`image`, (payload) => {
        setImage(payload);
      });
      socket.on(`success`, (payload) => {
        setSuccess((prev) => prev + 1);
      });
      socket.on(`error`, (payload) => {
        setError((prev) => prev + 1);
        setTextlog((prev) => {
          return [...prev, payload];
        });
      });
      socket.on(`stop`, (payload) => {
        toast.info("Đã dừng chương trình!!!");
      });
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCrawl = () => {
    fetch(process.env.REACT_APP_URL_SERVER + "/worker", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((rs) => {
        return rs.json();
      })
      .then((rs) => {
        if (!rs.success) {
          toast.error(rs.mes);
        } else {
          workerId.current = rs.mes._id;
        }
      });
    socket.emit("active");
  };
  const handleStop = () => {
    fetch(process.env.REACT_APP_URL_SERVER + "/worker/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId: workerId.current, id }),
    })
      .then((rs) => rs.json())
      .then((rs) => {
        if (!rs.success) toast.info(rs.mes);
      });
  };

  return (
    <div className="App">
      <header className="flex justify-around py-2 px-10 border-b border-b-gray-400">
        <div className="basis-1/3">
          <button
            className="px-4 py-2 border rounded-md hover:text-white hover:bg-gray-600"
            onClick={() => handleCrawl()}
          >
            Start
          </button>
          <button
            className="mx-4 px-4 py-2 border rounded-md hover:text-white hover:bg-red-500"
            onClick={() => handleStop()}
          >
            Stop
          </button>
        </div>
        <div className="flex justify-between basis-1/3">
          <div className="text-center">
            <p className="font-semibold">Success</p>
            <p className="text-green-500">{success}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Failed</p>
            <p className="text-red-500">{error}</p>
          </div>
          <NavLink to={"/list-bot"}>
            <button className="px-4 py-2 border rounded-md hover:text-white hover:bg-gray-600">
              Show list bot
            </button>
          </NavLink>
        </div>
      </header>
      <main className="p-9">
        <div className="flex gap-10">
          <div className="w-full border border-slate-400 rounded-md h-96 overflow-y-auto">
            <div className="flex flex-col-reverse">
              {textlog
                .slice()
                .reverse()
                .map((item, index) => {
                  return <p key={index}>{item}</p>;
                })}
            </div>
          </div>
          <div className="w-full border border-slate-400 rounded-md h-96 overflow-y-auto">
            {image && (
              <img
                src={`data:image/png;base64,${image}`}
                className="w-full h-full object-cover"
                alt="review"
              />
            )}
          </div>
        </div>
        {/* <table
      className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full"
      style={{ height: "200px" }}
    >
      <thead>
        <tr>
          <th>Tên</th>
          <th>Ảnh</th>
          <th>Giá</th>
          <th>Giới thiệu</th>
          <th>Ngày lấy tt</th>
        </tr>
      </thead>
      <tbody>
        {product?.map((item, index) => {
          return (
            <tr key={index} className="">
              <td>{item.name}</td>
              <td>
                <img src={item.image} alt="" />
              </td>
              <td>{item.price}</td>
              <td>hahaha</td>
              <td>{new Date(Number(item?.createdAt)).toString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table> */}
        {/* <div className="table-wrp block max-h-96">
      <table className="w-full">
        <thead class="bg-white border-b sticky top-0">
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Ảnh</th>
            <th>Giá</th>
            <th>Giới thiệu</th>
            <th>Ngày lấy tt</th>
          </tr>
        </thead>
        <tbody class="h-96 overflow-y-auto">
          {product?.map((item, index) => {
            return (
              <tr key={index} className="">
                <td>{index}</td>
                <td>{item.name}</td>
                <td>
                  <img src={item.image} alt="" />
                </td>
                <td>{item.price}</td>
                <td>{parse(item.description)}</td>
                <td>{new Date(Number(item?.createdAt)).toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div> */}
        <div className="grid grid-cols-12 gap-3 mt-10 border-b border-b-gray-500">
          <div className="font-bold text-center col-span-1">STT</div>
          <div className="font-bold text-center col-span-2">Tên</div>
          <div className="font-bold text-center col-span-2">Ảnh</div>
          <div className="font-bold text-center col-span-1">Giá</div>
          <div className="font-bold text-center col-span-4">Giới thiệu</div>
          <div className="font-bold text-center col-span-2">Ngày lấy tt</div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {product?.map((item, index) => {
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
      </main>
    </div>
  );
};

export default Home;
