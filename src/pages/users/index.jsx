import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Divider, Flex, Heading, IconButton, Skeleton, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { FaUserSlash } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";
import CMGButton from "../../components/CMGButton";
import CMGModal from "../../components/CMGModal";
import CMGSpinner from "../../components/CMGSpinner";
import CMGText from "../../components/CMGText";
import AddUserModalForm from "../../components/User/AddUserModalForm";
import { useAlertContext } from "../../contexts/AlertContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { useUserContext } from "../../contexts/UserContext";
import CMGPagination from "../../components/CMGPagination";

const LoaderShimmer = () => {
  return (
    <Flex direction="column" gap={3}>
      <Skeleton height={10} />
      <Box>
        <Skeleton height={20} mb={2} />
        <Skeleton height={20} />
      </Box>
    </Flex>
  )
}

const UserListPage = () => {
  const modalRef = React.useRef();
  const newUserFormormRef = React.useRef();
  const { getAllUsers, isFetchingUsers, users, usersMeta, deleteUser, addNewUser, updateNewUser } = useUserContext();
  const { user: currentUser } = useAuthContext();
  const { showAlertDialog, showAlert } = useAlertContext();
  const [pageSettings, setPageSettings] = useState({ page: 1, limit: 10 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    handleFetchUsers()
  }, [pageSettings]);

  const handleFetchUsers = useCallback(async () => {
    await getAllUsers({ page: pageSettings.page, limit: pageSettings.limit }, pageSettings?.page !== 1);
  }, [pageSettings])

  const handleDeleteUser = useCallback((user) => {
    if (user.id === currentUser?.id) return;

    showAlertDialog({
      title: 'Delete User',
      description: `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      onConfirm: async () => {
        await deleteUser(user.id);
      },
      onClose: () => { }
    })
  }, [currentUser])

  const onAddUserClick = useCallback(() => {
    modalRef.current.onOpen({
      title: 'Add User',
      description: 'Add a new user to the system.',
      content: <AddUserModalForm ref={newUserFormormRef} />,
      confirmButtonText: 'Add User',
      cancelButtonText: 'Cancel',
      confirmButtonColorScheme: 'green',
      confirmButtonIcon: <MdPersonAdd />,
      modalSize: "xl",
      onConfirm: handleAddNewUser,
      onDismiss: () => { }
    });
  }, [modalRef, newUserFormormRef]);

  const handleAddNewUser = useCallback(async () => {
    try {
      newUserFormormRef.current.submit(async (data) => {
        setIsSubmitting(true)
        addNewUser(data).then((newUser) => {
          setIsSubmitting(false)
          modalRef.current.onClose()
          showAlert({
            title: 'New User ',
            description: error.message || 'Something went wrong',
            status: 'error',
          });
        }).catch(() => {
          setIsSubmitting(false)
        })
      },
        () => {
          setIsSubmitting(false)
          showAlert({
            title: 'Error',
            description: "Some required fields are empty",
            status: 'error',
          });
        });
    } catch (error) {
      setIsSubmitting(false)
      showAlert({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
      });
    }

  }, [newUserFormormRef, modalRef, pageSettings])

  const onEditUserClick = useCallback((user) => {
    if (user.id === currentUser?.id) return;
    modalRef.current.onOpen({
      title: 'Edit User',
      description: 'Edit user details.',
      content: <AddUserModalForm ref={newUserFormormRef} user={user} isEdit />,
      confirmButtonText: 'Update User',
      cancelButtonText: 'Cancel',
      confirmButtonColorScheme: 'green',
      confirmButtonIcon: <MdPersonAdd />,
      modalSize: "xl",
      onConfirm: () => handleUpdateUser(user),
      onDismiss: () => { }
    });
  }, [modalRef, newUserFormormRef, currentUser]);

  const handleUpdateUser = useCallback(async (user) => {
    try {
      newUserFormormRef.current.submit(async (data) => {
        setIsSubmitting(true)
        updateNewUser({ user_id: `${user.id}`, role: data.role }).then((newUser) => {
          setIsSubmitting(false)
          modalRef.current.onClose()
          showAlert({
            title: 'User Updated',
            description: error.message || 'Something went wrong',
            status: 'error',
          });
        }).catch(() => {
          setIsSubmitting(false)
        })
      },
        () => {
          setIsSubmitting(false)
          showAlert({
            title: 'Error',
            description: "Some required fields are empty",
            status: 'error',
          });
        });
    } catch (error) {
      setIsSubmitting(false)
      showAlert({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
      });
    }

  }, [newUserFormormRef, modalRef, pageSettings])

  return (
    <React.Fragment>
      <CMGModal ref={modalRef} isSubmitting={isSubmitting} />
      <Flex justifyContent="space-between" alignItems="center" pr={1}>
        <Flex mt={0} flex={1} direction="column" sx={{ alignItems: "flex-start" }}>
          <Heading as="h2">User List</Heading>
          <CMGText>Manage Users</CMGText>
        </Flex>
        <CMGButton
          text="Add User"
          onClick={onAddUserClick}
          size='sm'
          variant="outline"
        />
      </Flex>
      <Divider />
      <Box>
        {isFetchingUsers ? (_.isEmpty(users) ? <CMGSpinner /> : <LoaderShimmer />) :
          _.isEmpty(users) ?
            <Flex direction="column" sx={{ alignItems: "center", justifyContent: "center", my: 20 }}>
              <FaUserSlash size={150} color="grey" />
              <CMGText>No Users found</CMGText>
            </Flex>
            :
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>First Name</Th>
                    <Th>Last Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    _.map(users, (user, index) => {
                      const colorScheme = user.user_role?.role?.name === 'ADMIN' ? 'green' : 'blue';
                      const isSameUser = user.id === currentUser?.id;
                      return (
                        <Tr key={index}>
                          <Td>{user.first_name}</Td>
                          <Td>{user.last_name}</Td>
                          <Td>{user.email}</Td>
                          <Td><Badge colorScheme={colorScheme}>{user.user_role?.role?.name}</Badge></Td>
                          <Td>
                            <Stack direction="row" spacing={4}>
                              <Tooltip label="Edit User">
                                <IconButton display={isSameUser ? "none" : "initial"} disabled={isSameUser} onClick={() => onEditUserClick(user)} aria-label="Edit" size="sm" colorScheme={isSameUser ? "gray" : "blue"} variant="outline" icon={<EditIcon />} />
                              </Tooltip>
                              <Tooltip label="Delete User">
                                <IconButton display={isSameUser ? "none" : "initial"} onClick={() => handleDeleteUser(user)} aria-label="Delete" size="sm" colorScheme={isSameUser ? "gray" : "red"} variant="solid" icon={<DeleteIcon />} />
                              </Tooltip>
                            </Stack>
                          </Td>
                        </Tr>
                      )
                    })
                  }
                </Tbody>
              </Table>
            </TableContainer>
        }
      </Box>
      {!_.isEmpty(users) && <CMGPagination meta={usersMeta} onPageChange={(page) => setPageSettings({ ...pageSettings, page })} />}
    </React.Fragment>
  )
}

export default UserListPage;