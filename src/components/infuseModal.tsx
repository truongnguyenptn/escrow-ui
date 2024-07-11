import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import {useState} from 'react';

interface InfuseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInfuse: (amount: number) => void;
}

const InfuseModal = ({isOpen, onClose, onInfuse}: InfuseModalProps) => {
    const [infuseAmount, setInfuseAmount] = useState<number>();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Infusing</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form
                        id="new-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onClose();
                            if (infuseAmount && infuseAmount !== 0)
                                onInfuse(infuseAmount);
                        }}>
                        <FormControl>
                            <FormLabel>
                                How many SOL do you want pay to infuse this NFT?
                            </FormLabel>
                            <Input
                                type="number"
                                variant="outline"
                                placeholder="amount"
                                value={infuseAmount}
                                onChange={(e) =>
                                    setInfuseAmount(
                                        Number(e.currentTarget.value)
                                    )
                                }
                            />
                            <FormHelperText>
                                1 carbon credit cost ~1.40$
                            </FormHelperText>
                        </FormControl>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        colorScheme="aquamarine"
                        type="submit"
                        form="new-form"
                        disabled={infuseAmount === 0}>
                        Infuse Now
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default InfuseModal;
