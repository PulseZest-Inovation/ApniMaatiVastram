import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Checkbox,
    Input,
    Link,
  } from "@nextui-org/react";
  import { FaEnvelope, FaLock } from "react-icons/fa"; // Using FontAwesome icons
  
// Define the types for the component props
interface UserModalProps {
    isOpen: boolean;           // Modal visibility
    onOpenChange: (isOpen: boolean) => void;  // Function to change modal visibility
  }

  // Main App component using useState
  export default function UserModal({ isOpen, onOpenChange }: UserModalProps) {
    return (
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 justify-center">Welcome Back 
            </ModalHeader>
          <ModalBody>
            <Input
              endContent={<FaEnvelope />}
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
            />
            <Input
              endContent={<FaLock />}
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
            />
            <div className="flex py-2 px-1 justify-between">
              <Checkbox
                classNames={{
                  label: "text-small",
                }}
              >
                Remember me
              </Checkbox>
              <Link color="primary" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={() => onOpenChange(false)}>
              Close
            </Button>
            <Button color="primary" variant="flat" onPress={() => onOpenChange(false)}>
              Sign in
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  