import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import Head from 'next/head';

const AboutStyles = styled.div`
  padding: 2rem;
  .ui.header {
    font-family: ${props => props.theme.font};
  }
  p {
    text-align: center;
  }
`;

class About extends Component {
  render() {
    return (
      <>
        <Head>
          <title key="title">Danni TV - Giới thiệu</title>
          <meta key="metaTitle" name="title" content="Danni TV - Giới thiệu" />
        </Head>
        <AboutStyles>
          <Container text>
            <Header as="h2" textAlign="center">
              💩MỤC ĐÍCH CỦA CHÚNG TÔI 💩
            </Header>
            <p>Phổ biến hóa kiến ​​thức toàn cầu.</p>
            <Header as="h2" textAlign="center">
              💩CHÚNG TÔI LÀM GÌ 💩
            </Header>
            <p>
              Cộng đồng của chúng tôi tìm hiểu, dịch và lồng tiếng cho các video
              trực tuyến sang các ngôn ngữ khác. Chúng tôi tập trung vào các nội
              dung có các yếu tố liên quan tới giáo dục, phát triển bản thân và
              chuyên môn, giải trí thông minh, với mong muốn chia sẻ những góc
              nhìn sâu sắc hơn về các vấn đề quan trọng trong xã hội. Thông qua
              hoạt động này, chúng tôi hy vọng nội dung của các video thú vị sẽ
              vượt qua được các giới hạn về ngôn ngữ và không gian và tới được
              với đông đảo khán giả.
            </p>
            <Header as="h2" textAlign="center">
              💩KÊU GỌI HÀNH ĐỘNG 💩
            </Header>
            <p>
              Hãy cùng nhau vượt qua các rào cản ngôn ngữ để mọi người có thể
              truy cập thư viện video tốt nhất của Internet.
            </p>
            <p>
              Các ngôn ngữ hiện đang được sử dụng: tiếng Séc, tiếng Anh và tiếng
              Việt.
            </p>
            {/* <Header as="h2">Join us!</Header>
            <p>
              BECOME A DUBBER Register and start dubbing. Use your phone or
              another device to start recording. Then just upload your audio
              recording file here to the existing YouTube video or add a new
              one. We are currently developing our own recording tool, meanwhile
              watch this video on how to record and upload.
            </p>

            <p>
              BECOME A TRANSLATOR Register and start translating. Use YouTube or
              some other tool to translate, and then share the text here for
              others to dub. We are currently developing our own translation
              tool, meanwhile watch this video on how to translate videos.
            </p>
            <p>
              SUPPORT THE PROJECT Subscribe and share the content you like. Give
              us feedback, write about us Mention us in your videos, blogs or
              posts. Join the team!
            </p> */}
            <p>Liên lạc: info.dannitv@gmail.com, (+420) 774897789</p>
          </Container>
        </AboutStyles>
      </>
    );
  }
}

export default About;
