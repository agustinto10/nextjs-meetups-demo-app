// our-domain.com/:meetupId

import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';

import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetailsPage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        title={props.meetupData.title}
        description={props.meetupData.description}
        address={props.meetupData.address}
        image={props.meetupData.image}
      />
    </Fragment>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://agustindemiddi:xeHl0hf1notVmHbw@cluster0.zfxd6ns.mongodb.net/meetupsDatabase?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const id = context.params.meetupId;

  const client = await MongoClient.connect(
    'mongodb+srv://agustindemiddi:xeHl0hf1notVmHbw@cluster0.zfxd6ns.mongodb.net/meetupsDatabase?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(id) });

  client.close();

  return {
    props: {
      // meetupData: {
      //   id: selectedMeetup._id.toString(),
      //   title: selectedMeetup.title,
      //   address: selectedMeetup.address,
      //   image: selectedMeetup.image,
      //   description: selectedMeetup.description,
      // },
      meetupData: {
        ...selectedMeetup,
        _id: selectedMeetup._id.toString(),
      },
    },
  };
}

export default MeetupDetailsPage;
