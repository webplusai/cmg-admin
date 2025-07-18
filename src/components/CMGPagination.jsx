import { Box, Button, IconButton, Stack } from "@chakra-ui/react";
import React, { useCallback } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const CMGPagination = ({ meta, onPageChange }) => {
  const { totalPages, currentPage } = meta;

  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > totalPages || page === Number(currentPage)) return;
    onPageChange(page);
  }, [currentPage, totalPages])

  const renderPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(
      <IconButton size={'sm'} key={0} disabled={currentPage === 1} onClick={() => handlePageChange(Number(currentPage) - 1)} icon={<FaAngleLeft />} />
    )
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button size={'sm'} key={i} disabled={currentPage === i} colorScheme={Number(currentPage) === i ? "blue" : "gray"} onClick={() => handlePageChange(i)}>{i}</Button>
      );
    }
    pageNumbers.push(
      <IconButton size={'sm'} key={totalPages + 2} disabled={currentPage === totalPages} className={`list-group-item ${totalPages === currentPage ? 'active' : ''}`} onClick={() => handlePageChange(Number(currentPage) + 1)} icon={<FaAngleRight />} />
    )
    return pageNumbers;
  };

  return (
    <Box m={2} width="100%" display="flex" justifyContent="flex-end">
      <Stack direction={"row"} gap={1}>{renderPageNumbers()}</Stack>
    </Box>
  );
};

export default CMGPagination;
