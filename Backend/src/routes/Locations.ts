import express from 'express';
import { Location } from '../models/Location';

const router = express.Router();

router.get('/data', async (req, res) => {
  const { view, location } = req.query;
  let query: any = {};
  
  if (view === 'branch') {
    query.type = 'branch';
  } else {
    query.type = 'location';
  }
  
  if (location) {
    query.parentLocation = location;
  }
  
  try {
    const data = await Location.find(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/data/:id', async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/seed', async (req, res) => {
  const seedData = [
    {
      location: 'Colorado',
      potentialRevenue: { value: 624596, percentage: 33.48 },
      competitorProcessingVolume: { value: 52049666, percentage: 33.33 },
      competitorMerchant: 195,
      revenuePerAccount: 3203,
      marketShareByRevenue: 33.33,
      commercialDDAs: 220,
      type: 'location'
    },
    {
      location: 'Florida',
      potentialRevenue: { value: 600628, percentage: 32.19 },
      competitorProcessingVolume: { value: 52049666, percentage: 33.33 },
      competitorMerchant: 195,
      revenuePerAccount: 3203,
      marketShareByRevenue: 33.33,
      commercialDDAs: 220,
      type: 'location'
    },
    {
      location: 'Mississippi',
      potentialRevenue: { value: 640596, percentage: 34.33 },
      competitorProcessingVolume: { value: 51385666, percentage: 33.33 },
      competitorMerchant: 198,
      revenuePerAccount: 3114,
      marketShareByRevenue: 33.33,
      commercialDDAs: 792,
      type: 'location'
    },
    {
      location: 'Branch 1',
      potentialRevenue: { value: 878269, percentage: 34.96 },
      competitorProcessingVolume: { value: 73189083, percentage: 33.33 },
      competitorMerchant: 287,
      revenuePerAccount: 3060,
      marketShareByRevenue: 33.33,
      commercialDDAs: 1148,
      type: 'branch',
      parentLocation: 'Colorado'
    },
    {
      location: 'Branch 2',
      potentialRevenue: { value: 822775, percentage: 33.33 },
      competitorProcessingVolume: { value: 68564583, percentage: 33.33 },
      competitorMerchant: 257,
      revenuePerAccount: 3201,
      marketShareByRevenue: 33.33,
      commercialDDAs: 1028,
      type: 'branch',
      parentLocation: 'Florida'
    },
    {
      location: 'Branch 3',
      potentialRevenue: { value: 817009, percentage: 32.52 },
      competitorProcessingVolume: { value: 68084083, percentage: 33.33 },
      competitorMerchant: 252,
      revenuePerAccount: 3242,
      marketShareByRevenue: 33.33,
      commercialDDAs: 1008,
      type: 'branch',
      parentLocation: 'Mississippi'
    }
  ];

  try {
    await Location.deleteMany({});
    await Location.insertMany(seedData);
    res.json({ message: 'Data seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error seeding data' });
  }
});


export { router as locationRoutes };

