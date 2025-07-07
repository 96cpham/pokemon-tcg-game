import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import './App.css'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

function App() {
  //keeps score of the game
  const [score, setScore] = useState(0)
  //gets the array of card IDs
  const [cards, setCards] = useState([])
  // State variables to hold the two random cards by their ID
  const [cardOne, setCardOne] = useState()
  const [cardTwo, setCardTwo] = useState()
  // State variables to hold the card images for the left and right cards
  // These will be updated when the "New Cards" button is clicked
  const [cardbackLeft, setCardbackLeft ] = useState('Cardback.png')
  const [cardbackRight, setCardbackRight] = useState('Cardback.png')
// State variables to hold the card data for the left and right cards
  const [cardOneData, setCardOneData] = useState(null)
  const [cardTwoData, setCardTwoData] = useState(null)
//holds the price of the cards
  const [showPrices, setShowPrices] = useState(false)
  const [guessMade, setGuessMade] = useState(false)
  const [openWinDialog, setOpenWinDialog] = useState(false)


  const requestOptions = {
    method: 'GET',
    headers:{"X-Api-Key": import.meta.env.VITE_POKEMON_APP_API_KEY},
    redirect: 'follow'
  };
 
  //on first page load, fetch all the card ID data from the API
  useEffect(() => {
    fetchCards()
    console.log("useEffect called")
  }, [],)
    

  //fetch all the card IDs from the API
  async function fetchCards() {
    const response = await fetch("https://api.pokemontcg.io/v2/cards?q=-rarity:Common&select=id", requestOptions)
    const data = await response.json()
    setCards(data.data) // The API returns { data: [...] } and stores it in state
    console.log(data.data)
  }

 //gets card information from the API using the card ID
  async function getCard(cardID){
    const response = await fetch(`https://api.pokemontcg.io/v2/cards/${cardID}`, requestOptions)
    const data = await response.json()
    console.log("get card")
    return data.data
    
  }

  
  
  //this function is called when the "New Cards" button is clicked
  async function handleNewCards() {
  //get two random card IDs from the cards array  
    if (cards && cards.length > 1) {
      let randomIndexOne = Math.floor(Math.random() * cards.length)
      let randomIndexTwo
      do {
        randomIndexTwo = Math.floor(Math.random() * cards.length)
      } while (randomIndexTwo === randomIndexOne)
  //and set them to cardOne and cardTwo state variables
      const cardOneObj = cards[randomIndexOne]
      const cardTwoObj = cards[randomIndexTwo]

      setCardOne(cardOneObj)
      setCardTwo(cardTwoObj)

      // Fetch card details and set images
      const cardOneData = await getCard(cardOneObj.id)
      const cardTwoData = await getCard(cardTwoObj.id)
      console.log(cardOneData)
      console.log(cardTwoData)
      setCardOneData(cardOneData)
      setCardTwoData(cardTwoData)
      setCardbackLeft(cardOneData.images.large)
      setCardbackRight(cardTwoData.images.large)
      setGuessMade(false) // Reset guess state when new cards are fetched
      setShowPrices(false) // Reset price visibility when new cards are fetched
    }
  }

    
  function getPrice(cardData) {
    // Example: use cardData.cardmarket?.prices?.averageSellPrice or fallback
    return cardData?.cardmarket?.prices?.averageSellPrice ?? Math.floor(Math.random() * 100) / 10 + 1
  }
  
    function handleGuess(which) {
      if (!guessMade) {
        setShowPrices(true)
        setGuessMade(true)
        const priceOne = getPrice(cardOneData)
        const priceTwo = getPrice(cardTwoData)
        if (
          (which === 'left' && priceOne >= priceTwo) ||
          (which === 'right' && priceTwo >= priceOne)
        ) {
          setScore(score + 10) 
        }
      }
    }

  useEffect(() => {
    if (score >= 50) {
      setOpenWinDialog(true)
    }
  }, [score])

  return (
    <>

    <Typography variant="h3" style={{ textAlign: 'center', marginTop: '20px' }}>
      Pokemon TCG Price Guessing Game
    </Typography>

    <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px' }}>
      Score : {score}
    </Typography>

      <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Card
            sx={{ maxWidth: 250, cursor: guessMade ? 'default' : 'pointer', opacity: guessMade ? 0.8 : 1 }}
            onClick={() => !guessMade && handleGuess('left')}
            raised={!guessMade}
          >
            <img src={cardbackLeft} alt="Card Back Left" style={{ width: '100%' }} />
            {cardOneData && (
              <div style={{ padding: '10px' }}>
                <div><strong>Name:</strong> {cardOneData.name}</div>
                <div><strong>Rarity:</strong> {cardOneData.rarity}</div>
                <div><strong>Set:</strong> {cardOneData.set?.name}</div>
                {showPrices && (
                  <div style={{ color: 'green', marginTop: '10px' }}>
                    <strong>Price:</strong> ${getPrice(cardOneData).toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card
            sx={{ maxWidth: 250, cursor: guessMade ? 'default' : 'pointer', opacity: guessMade ? 0.8 : 1 }}
            onClick={() => !guessMade && handleGuess('right')}
            raised={!guessMade}
          >
            <img src={cardbackRight} alt="Card Back Right" style={{ width: '100%' }} />
            {cardTwoData && (
              <div style={{ padding: '10px' }}>
                <div><strong>Name:</strong> {cardTwoData.name}</div>
                <div><strong>Rarity:</strong> {cardTwoData.rarity}</div>
                <div><strong>Set:</strong> {cardTwoData.set?.name}</div>
                 {showPrices && (
                  <div style={{ color: 'green', marginTop: '10px' }}>
                    <strong>Price:</strong> ${getPrice(cardTwoData).toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </Container>

      <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px', backgroundColor: "white", opacity: .8, borderRadius: '10px',}}>
        <Typography variant="h5" style={{ textAlign: 'center', marginTop: '20px' }}>
          Guess which card is more expensive by clicking on it!
        </Typography>
      </Container>

      <Button variant="contained" style={{ padding: '10px 20px', marginTop: '20px' }}
        onClick={ handleNewCards }
      >
        New Cards
      </Button>

      <Dialog open={openWinDialog} onClose={() => setOpenWinDialog(false)}>
        <DialogTitle>Congratulations!</DialogTitle>
        <DialogContent>
          You win!
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWinDialog(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default App
