// /api/new-meetup
// POST /api/new-meetup

import { MongoClient } from 'mongodb';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;

    // const { title, description, address, image } = data;

    const client = await MongoClient.connect(
      'mongodb+srv://agustindemiddi:xeHl0hf1notVmHbw@cluster0.zfxd6ns.mongodb.net/meetupsDatabase?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });
  }
};

export default handler;
