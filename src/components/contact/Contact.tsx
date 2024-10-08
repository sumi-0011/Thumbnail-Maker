import React from "react";
import { Toggle } from "../ui/toggle";
import { ContactIcon, Github, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function Contact() {
  return (
    <div className="fixed bottom-3 right-2">
      <Popover>
        <PopoverTrigger className="flex items-center gap-2 rounded-full bg-background px-4 py-2">
          <Info color="#fff" size={18} />
          <span className="text-sm font-medium">CONTACT US</span>
        </PopoverTrigger>
        <PopoverContent>
          {/* <p>문의사항이 있으시면 GitHub 이슈를 등록해 주세요. 최대한 빠르게 답변 드리겠습니다.</p> */}
          <p>please register github issue</p>
          <a
            href="https://github.com/sumi-0011/Thumbnail-Maker/issues"
            target="_blank"
            rel="noreferrer"
          >
            <div className="mt-3 flex w-fit items-center gap-2 rounded-full border-2 border-white/70 px-3 py-[6px] hover:bg-white/10">
              <Github size={20} />
              <span>Github</span>
            </div>
          </a>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Contact;
