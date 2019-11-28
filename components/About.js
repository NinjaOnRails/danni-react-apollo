import Head from 'next/head';
import { Container, Header } from 'semantic-ui-react';
import styled from 'styled-components';

const AboutStyle = styled.div`
  padding: 2rem;
`;

const About = () => (
  <>
    <Head>
      <title key="title">Danni TV - Giới thiệu</title>
      <meta key="metaTitle" name="title" content="Danni TV - Giới thiệu" />
    </Head>
    <AboutStyle>
      <Container text>
        <Header as="h2">OUR MISSION</Header>
        <p>To help democratise global knowledge.</p>
        <Header as="h2">WHAT WE DO</Header>
        <p>
          Our community researches, translates and dubs relevant online videos
          into other languages. We focus on video content which we believe to
          contain elements of education, inspiration, personal and professional
          growth, smart entertainment, and insights about issues that matter.
        </p>
        <Header as="h2">CALL FOR ACTION</Header>
        <p>
          Let's break down language barriers so everyone can access internet’s
          finest video library.
        </p>
        <p>Currently served languages: Czech, English, and Vietnamese.</p>
        <Header as="h2">Join us!</Header>
        <p>
          BECOME A DUBBER Register and start dubbing. Use your phone or another
          device to start recording. Then just upload your audio recording file
          here to the existing YouTube video or add a new one. We are currently
          developing our own recording tool, meanwhile watch this video on how
          to record and upload.
        </p>
        <p>
          BECOME A TRANSLATOR Register and start translating. Use YouTube or
          some other tool to translate, and then share the text here for others
          to dub. We are currently developing our own translation tool,
          meanwhile watch this video on how to translate videos.
        </p>
        <p>
          SUPPORT THE PROJECT Subscribe and share the content you like. Give us
          feedback, write about us Mention us in your videos, blogs or posts.
          Join the team!
        </p>
        <p>Contact: info.dannitv@gmail.com, (+420) 774897789</p>
      </Container>
    </AboutStyle>
  </>
);
export default About;
