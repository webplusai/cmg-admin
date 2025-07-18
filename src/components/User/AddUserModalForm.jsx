import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../../contexts/UserContext';
import { Box, Flex, FormControl, FormHelperText, FormLabel, Input, Select } from '@chakra-ui/react';

const AddUserModalForm = forwardRef(({ user, isEdit }, ref) => {
    const { userRoles } = useUserContext();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        if (user) {
            setValue('first_name', user.first_name || '');
            setValue('last_name', user.last_name || '');
            setValue('email', user.email || '');
            setValue('role', user.user_role?.role?.name || '');
        } else {
            // Reset form fields if user prop is null or undefined
            reset();
        }
    }, [user]);

    useImperativeHandle(ref, () => ({
        reset: () => {
            reset();
        },
        submit: async (onValid, onInvalid) => {
            await handleSubmit(
                async (data) => {
                    await onValid(data);
                },
                () => {
                    onInvalid();
                }
            )();
        }
    }));

    return (
        <form>
            <Box>
                <Flex gap={10} mb={5}>
                    <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input disabled={isEdit} type="text" {...register('first_name', { required: 'First Name is required' })} variant="flushed" />
                        <FormHelperText color="red">{errors.first_name && errors.first_name.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input disabled={isEdit} type="text" {...register('last_name', { required: 'Last Name is required' })} variant="flushed" />
                        <FormHelperText color="red">{errors.last_name && errors.last_name.message}</FormHelperText>
                    </FormControl>
                </Flex>
                <FormControl mb={5}>
                    <FormLabel>Email address</FormLabel>
                    <Input disabled={isEdit} type="email" {...register('email', { required: 'Email is required' })} variant="flushed" />
                    <FormHelperText color="red">{errors.email && errors.email.message}</FormHelperText>
                </FormControl>
                {!isEdit && <Flex gap={10} mb={5}>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" {...register('password', { required: 'Password is required' })} variant="flushed" />
                        <FormHelperText color="red">{errors.password && errors.password.message}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input type="password" {...register('confirm_password', { required: 'Confirm Password is required' })} variant="flushed" />
                        <FormHelperText color="red">{errors.confirm_password && errors.confirm_password.message}</FormHelperText>
                    </FormControl>
                </Flex>}
                <FormControl mb={5}>
                    <FormLabel>Role</FormLabel>
                    <Select placeholder="Select option" {...register('role', { required: 'Role is required' })} variant="flushed">
                        {userRoles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </Select>
                    <FormHelperText color="red">{errors.role && errors.role.message}</FormHelperText>
                </FormControl>
            </Box>
        </form>
    );
});

export default AddUserModalForm;
