"use client";
import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Box,
  CircularProgress,
  Button
} from '@mui/material';

interface Dentist {
  id: number;
  fullName: string;
  email: string;
  address: string;
  mobileNo: string;
  ratings: string;
  qualification: string;
  about: string;
  reviews: string;
  experienceYears: string;
}

const Dentist = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dentistData, setDentistData] = useState<Dentist[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchDentistData = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/dentist?page=${page + 1}&size=${rowsPerPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setDentistData(responseData?.data?.data || []);
          setTotalRows(responseData.data.total);
        } else {
          const errorData = await response.json();
          console.log(errorData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDentistData();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    console.log("search >>>>>>>>>>>", searchValue);

    const searchDentistData = async () => {
      try {
        const response = await fetch('http://localhost:8080/typesense/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: "doctor",
            q: searchValue,
            query_by: "fullName,email,address,mobileNo,ratings,qualification,about,reviews,experienceYears"
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setDentistData(responseData.data.hits);
          setTotalRows(responseData.data.found);
        } else {
          const errorData = await response.json();
          console.log(errorData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    searchDentistData();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 h-screen">
      <Typography variant="h4" gutterBottom sx={{ color: 'black', margin: '20px 0' }}>
        Dentist Information
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}>
        <FormControl sx={{ m: 1, width: '300px' }} size="small">
          <InputLabel htmlFor="outlined-adornment-amount">Search</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            }
            label="Search"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </FormControl>
        <Button variant="contained" size="small" sx={{ height: '40px', m: 1 }} onClick={handleSearch}>Search</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ width: '80%', margin: '20px 0' }}>
          <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: '1px solid #ccc' }}>ID</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Full Name</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Email</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Address</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Mobile No</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Ratings</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Qualification</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>About</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Reviews</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Years of Experience</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {totalRows > 0 ? (
                dentistData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.id}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.fullName}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.email}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.address}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.mobileNo}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.ratings}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.qualification}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.about}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.reviews}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.experienceYears}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', padding: '20px' }}>
                    No records found !
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default Dentist;