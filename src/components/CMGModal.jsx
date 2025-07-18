import { Button, Divider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import CMGText from "./CMGText";

const CMGModal = forwardRef((props, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [modalConfig, setModalConfig] = useState({
        title: '',
        description: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonColorScheme: '',
        onConfirm: () => { },
        onDismiss: () => { },
        content: null,
        ...props
    })

    const onDismiss = useCallback(() => {
        onClose()
        setModalConfig(null)
    }, [onClose])

    useImperativeHandle(ref, () => ({
        onOpen: (config) => {
            setModalConfig(config)
            onOpen()
        },
        onClose: onDismiss
    }))

    return (
        <>
            <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onDismiss} size={modalConfig?.modalSize || "md"}>
                <ModalOverlay />
                <ModalContent position={"sticky"}>
                    <ModalHeader>
                        {modalConfig?.title}
                        {modalConfig?.description &&
                            <CMGText sx={{ fontSize: 16, fontWeight: '400', mt: -2 }} color="grey">
                                {modalConfig?.description}
                            </CMGText>
                        }
                    </ModalHeader>
                    <ModalCloseButton />
                    <Divider mb={5} />
                    <ModalBody>
                        {modalConfig?.content}
                    </ModalBody>
                    {modalConfig?.confirmButtonText &&
                        <ModalFooter>
                            <Button
                                mr={3}
                                onClick={onDismiss}
                                variant='ghost'
                                disabled={props?.isSubmitting}
                            >
                                {modalConfig?.cancelButtonText || 'Cancel'}
                            </Button>
                            <Button
                                variant='solid'
                                onClick={modalConfig?.onConfirm}
                                rightIcon={modalConfig?.confirmButtonIcon}
                                colorScheme={modalConfig?.confirmButtonColorScheme || 'green'}
                                isLoading={props?.isSubmitting}
                            >
                                {modalConfig?.confirmButtonText}
                            </Button>
                        </ModalFooter>}
                </ModalContent>
            </Modal>
        </>
    )
})

export default CMGModal;