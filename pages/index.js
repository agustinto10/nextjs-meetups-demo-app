// our-domain.com/

import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetUpList from '../components/meetups/MeetupList';

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a hugh list of highly active React meetups'
        />
      </Head>
      <MeetUpList meetups={props.meetups} />
    </Fragment>
  );
};

// async function getStaticProps():
// only for page components (NextJS reserved name)
// it's executed during the build proccess, before the pre-render
// it's never executed on the client side
// great for Search Engines because:
// data is not fetched in a second component render cycle on the client
// so it contains the full HTML code when it pre-renders
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://agustindemiddi:xeHl0hf1notVmHbw@cluster0.zfxd6ns.mongodb.net/meetupsDatabase?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

// // async function getServerSideProps():
// // only for page components (NextJS reserved name)
// // does not run during the build proccess
// // runs always on the server after deployment
// // it's never executed on the client side
// // better for apps whose data that changes multiple times every second
// // better for apps that needs access to the request object (authenticatiion)
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
