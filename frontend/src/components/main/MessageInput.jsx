import React, { useRef, useState } from "react";
import { useChatContext } from "../../context/chatSlice";
import Input from "../ui/Input";
import Button from "../ui/Button";
import useMessages from "../../context/zustand/message";
import { requestHandler } from "../../utills";
import toast from "react-hot-toast";
import { sendMessageInChat } from "../../api/api";
import { XCircle, PlusCircle } from "lucide-react";

const MessageInput = () => {
  const [inputMessage, setInputMessage] = useState("");
  const { selectedChat } = useChatContext();
  const { messages, setMessages } = useMessages();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const fileInputRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (selectedFile.length > 5) {
      toast.error("maximum 5 file you can upload!");
      return;
    }
    if (inputMessage == "" && selectedFile.length == 0) {
      toast.error("message content or file required !");
      return;
    }
    const newFormData = new FormData();
    newFormData.append("content", inputMessage);
    console.log(selectedFile);
    selectedFile.forEach((file, index) => {
      newFormData.append("attachmentFiles", file);
    });
    requestHandler(
      async () =>
        await sendMessageInChat({
          data: newFormData,
          chatId: selectedChat._id,
        }),
      setLoading,
      (res) => {
        const { data } = res;
        console.log(data);
        setMessages([...messages, data]);
        setInputMessage("");
        setSelectedFile([]);
      },
      (err) => {
        toast.error(err);
      }
    );
  };

  const handleFileChange = (e) => {
    const currentFile = e.target.files;
    setSelectedFile([...selectedFile, ...currentFile]);
  };

  const removeFromSelectedFile = (image) => {
    const filteredFiles = selectedFile.filter(
      (file) => file.name != image.name
    );
    setSelectedFile(filteredFiles);
  };

  return (
    <div>
      <div className="w-full">
        {selectedFile.length > 0 && (
          <div className="w-fit bg-gray-700 flex p-4 mb-4 justify-start rounded-lg">
            {selectedFile.map((image, index) => {
              const file = URL.createObjectURL(image);
              return (
                <div className="w-[100px] h-[100px] mr-4 relative rounded-lg">
                  <img
                    key={index}
                    src={file}
                    alt={`Preview ${index}`}
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                    }}
                    className="rounded-lg h-full w-full object-cover	opacity-50	"
                  />
                  <XCircle
                    className="z-2 absolute top-[-10px] right-[-10px] text-white "
                    width={32}
                    onClick={() => removeFromSelectedFile(image)}
                  />
                </div>
              );
            })}
          </div>
        )}
        <form onSubmit={sendMessage}>
          <div>
            <Button
              onclick={() => fileInputRef.current.click()}
              type="button"
              className="bg-gray-700 mb-4 p-2 flex flex-col justify-center items-center gap-2"
            >
              <PlusCircle width={32} height={32} />
              Add Photos/images
            </Button>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
              className="mb-2"
            />

            <Input
              type="text"
              className="p-4 w-[50%] mb-2 rounded-md mr-2 focus:outline-none"
              placeholder="Send a message"
              onchange={(e) => setInputMessage(e.target.value)}
              value={inputMessage}
            />

            <Button className="p-4 bg-slate-700">Send</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
