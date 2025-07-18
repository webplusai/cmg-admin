import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import React, { useCallback, useState } from 'react';

const CMGAlertDialog = (dialogProps) => {
    const [loading, setLoading] = useState(false);
    const {
        title,
        description,
        setAlertDialogContentConfig,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColorScheme,
        onConfirm,
        onClose
    } = dialogProps;

    const handlePositiveButtonClick = useCallback(async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
        onClose();
        setAlertDialogContentConfig(null);
    }, [onConfirm, onClose]);

    return (
        <AlertDialog
            isOpen={true}
            onClose={() => {
                onClose()
                setAlertDialogContentConfig(null)
            }}
            {...dialogProps}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">{title}</AlertDialogHeader>
                    <AlertDialogBody>{description}</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={() => {
                            onClose()
                            setAlertDialogContentConfig(null)
                        }}>
                            {cancelButtonText || 'Cancel'}
                        </Button>
                        <Button
                            isLoading={loading}
                            colorScheme={
                                confirmButtonColorScheme || 'red'
                            }
                            onClick={handlePositiveButtonClick}
                            ml={3}
                        >
                            {confirmButtonText || 'Confirm'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
};

export default CMGAlertDialog;