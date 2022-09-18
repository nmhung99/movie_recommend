import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { memo } from "react";

const MovieItem = (item) => {
  const { name, rating, genres, showings } = item.item;
  const timeShowings = [];
  showings.forEach((elm) => {
    timeShowings.push(`${(elm - elm%60)/60}:${elm%60 === 0 ? '00' : elm%60}`);
  });
  
  return (
    <>
      <Grid item align="center" xs={3} md={4} lg={6} sx={{margin: 'auto'}}>
        <Card sx={{ maxWidth: 600, textAlign: 'left' }}>
          <CardActionArea>
            <CardContent>
              <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
                {name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Rating: {rating}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {/* Genres: {genres.map((item, index) => <span key={index}>{item}, </span>)} */}
                Genres:{" "}
                {genres.map((item, index) => {
                  if (index === genres.length - 1) {
                    return <span key={index}>{item}</span>;
                  }
                  return <span key={index}>{item}, </span>;
                })}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Time:{" "}
                { timeShowings.map((item, index) => {
                  if (index === timeShowings.length - 1) {
                    return <span key={index}>{item}</span>;
                  }
                  return <span key={index}>{item} || </span>;
                })}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  );
};

export default memo(MovieItem);
