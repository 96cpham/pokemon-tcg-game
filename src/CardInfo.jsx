import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Container  from "@mui/material/Container";


export default function CardInfo({ image, cost, name, rarity, setName }) {
  return (
    <Container maxWidth="sm">
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cost: {cost ? cost.join(", ") : "N/A"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rarity: {rarity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set: {setName}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}