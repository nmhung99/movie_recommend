import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import {Box, Typography, TextField, Button, Grid, FormControl, Select, MenuItem,} from "@mui/material";
import MovieItem from "./MovieItem";
import { Container } from "@mui/system";

const SearchMovie = () => {
  const [listMovie, setListMovie] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [timeSearch, settimeSearch] = useState("");
  const [result, setResult] = useState([]);
  const [validator, setValidator] = useState({});
  const [submitSearch, setSubmitSearch] = useState(false);

  //Define function get data from json file
  const getMovie = async () => {
    try {
      const fetchMovie = await axios.get("datamovie.json");
      const dataMovie = await fetchMovie.data;
      console.log(dataMovie);
      return dataMovie;
    } catch (error) {
      console.log(error);
    }
  };

  // Get data moive at 1st time mout
  useEffect(() => {
    getMovie().then((dataMovie) => {
      dataMovie.forEach((elm) => {
        elm.showings.forEach((show, index) => {
          const splitShow = show.split(':');
          elm.showings[index] = +splitShow[0]*60 + +splitShow[1];
        });
      });
      setListMovie(dataMovie);
      setResult(dataMovie);
    });
  }, []); 

  console.log(listMovie);

  // Define function validate Form search
  const validateForm = (inputSearch, timeSearch) => {
    const errValidate = {};
    if (!inputSearch) {
      errValidate.genres = "Please choose genres";
    }
    if (!timeSearch) {
      errValidate.time = "Please choose time";
    }
    return errValidate;
  };

  // Handle when click button Search Now
  const handleSearch = () => {
    const checkGenresMovie = listMovie.filter((item) =>
      item.genres.includes(inputSearch)
    );

    setValidator(validateForm(inputSearch, timeSearch));

    if (checkGenresMovie.length > 0 && timeSearch) {
      const timeSearchToMinutes = +timeSearch.split(":")[0] * 60 + +timeSearch.split(":")[1];

      const getResultMovie = [];
      checkGenresMovie.forEach(movie => {
        const copiedMovie = Object.assign({}, movie);
        const filterShow = movie.showings.filter((show) => {
          return show - timeSearchToMinutes >= 30;
        });

        copiedMovie.showings = [filterShow[0]];
        if (movie.showings.includes(filterShow[0])) {
          getResultMovie.push(copiedMovie);
        }
        console.log(copiedMovie);
      });

      console.log(getResultMovie);
      if (getResultMovie.length > 0) {
        getResultMovie.sort((a,b) => (b.rating - a.rating))
        setSubmitSearch(true);
        setResult(getResultMovie);
      } else {
        setResult([]);
      }
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <Typography variant="h3" sx={{ paddingTop: 6, textAlign: "center" }}>
        Movie Recommendation
      </Typography>
      <Box sx={{paddingTop: 4, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Box sx={{height: 100}}>
          <Typography variant="h5" sx={{ paddingRight: 2 }}>
            Genres:
          </Typography>
          <FormControl sx={{ minWidth: 120, paddingRight: 6 }}>
            <Select
              sx={{ width: 240, marginTop: 1 }}
              value={inputSearch}
              displayEmpty
              IconComponent={MovieFilterIcon}
              inputProps={{ "aria-label": "Without label" }}
              onChange={(e) => {
                setInputSearch(e.target.value);
                setValidator({ ...validator, genres: "" });
              }}
            >
              <MenuItem value="">Select Genres</MenuItem>
              {
                listMovie && listMovie.reduce((initArr, currentvalue) => {
                      return [...new Set(initArr.concat(currentvalue.genres))];
                    }, []).sort().map((genres, i) => (
                      <MenuItem key={i} value={genres}>
                        {genres}
                      </MenuItem>
                    ))
              }
            </Select>
          </FormControl>
          <Typography color={"error"}>{validator.genres}</Typography>
        </Box>

        <Box sx={{ height: 100 }} >
          <Typography variant="h5" sx={{ paddingRight: 2 }}>
            Time:
          </Typography>
          <TextField
            sx={{ paddingRight: 6, width: 180, marginTop: 1 }}
            variant="outlined"
            type={"time"}
            value={timeSearch}
            onChange={(e) => {
              settimeSearch(e.target.value);
              setValidator({ ...validator, time: "" });
            }}
          />
          <Typography color={"error"}>{validator.time}</Typography>
        </Box>

        <Box sx={{ height: 100, width: 200, position: "relative"}} >
          <Button 
            variant="contained" 
            sx={{ fontSize: 18, padding: "13px 28px", position: "absolute", bottom: 4}} 
            onClick={handleSearch} 
          >
            Search Now
          </Button>
        </Box>
      </Box>

      <Container>
        <Box sx={{ paddingTop: 3, paddingBottom: 6 }} >
          {result.length > 0 ? (
            <>
              <Typography textAlign={"center"} variant="h5" sx={{paddingBottom: 2}}>
                 {submitSearch ? `Found ${result.length} movie match with your requirement` : `Our List Movie`}
              </Typography>
              <Grid container spacing={3}>
                {result.map((item, i) => (
                  <MovieItem key={i} item={item} />
                ))}
              </Grid>
            </>
          ) : (
            <Typography textAlign={"center"} variant="h4">
              Sorry, there is no matching movie for your requirement
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default SearchMovie;