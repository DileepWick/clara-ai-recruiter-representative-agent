import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@heroui/react";

import { ViewIcon } from "lucide-react";

export default function App({ contents, buttonName, Title }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="default"
        onPress={onOpen}
        size="sm"
        variant="ghost"
        startContent={<ViewIcon size={14} />}
      >
        {buttonName}
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        radius="lg"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{Title}</ModalHeader>
              <ModalBody className="overflow-y-auto max-h-[calc(100vh-200px)]">
                <Textarea
                  value={contents}
                  style={{
                    fontFamily: "Poppins",
                  }}
                  readOnly
                  className="bg-[#0d0c1d] text-[#ffffff]"
                  rows={10}
                  placeholder="No data available"
                />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
