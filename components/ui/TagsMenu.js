import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import Link from 'next/link';

const defaultTags = [
  { name: 'tech', text: 'Công nghệ' },
  { name: 'sci', text: 'Khoa học' },
  { name: 'design', text: 'Thiết kế' },
  { name: 'business', text: 'Kinh doanh' },
  { name: 'innovation', text: 'Đổi mới công nghệ' },
  { name: 'social', text: 'Thay đổi xã hội' },
  { name: 'health', text: 'Sức khỏe' },
  { name: 'nature', text: 'Thiên nhiên' },
  { name: 'environment', text: 'Môi trường' },
  { name: 'future', text: 'Tương lai' },
  { name: 'communication', text: 'Giao tiếp' },
  { name: 'child', text: 'Sự phát triển của trẻ nhỏ' },
  { name: 'personal', text: 'Phát triển cá nhân' },
  { name: 'Humanity', text: 'Nhân loại' },
  { name: 'society', text: 'Xã hội' },
  { name: 'identity', text: 'Danh tính' },
  { name: 'community', text: 'Cộng đồng' },
  { name: 'inspiration', text: 'Cảm hứng hay động lực' },
  { name: 'professional', text: 'Phát triển sự nghiệp' },
  { name: 'smart', text: 'Giải trí thông minh' },
  { name: 'ideas', text: 'Ý tưởng để tự cải thiện' },
  { name: 'stories', text: 'Những câu chuyện' },
];

const StyledList = styled.div`
  /* padding: 0 30px; */
  justify-content: center;
  text-align: center;
  font-family: ${props => props.theme.font};

  ul {
    list-style: none;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* li {
      display: inline-block;
    } */
    /* justify-content: center;
    display: flex; */
  }
`;

const StyledTag = styled.li`
  opacity: 0;
  animation: FadeIn 1s forwards;
  animation-fill-mode: both;
  animation-delay: ${props => (props.i + 1) * 0.1}s;
  margin: 2.5px;
  @keyframes FadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
const TagsMenu = () => {
  const router = useRouter();
  return (
    <StyledList>
      <h2>Lựa chọn chủ đề:</h2>
      <ul>
        {defaultTags.map(({ name, text }, i) => {
          let query = router.query.tag || '';
          const tagMatch = query.includes(name);
          if (query.includes(name)) {
            query = query.replace((',' + name).toString(), ' ');
            query = query.replace(name.toString(), ' ');
          } else {
            if (!query) {
              query = name;
            } else {
              query = query + ',' + name;
            }
          }
          query = decodeURI(query);
          return (
            <StyledTag key={name} i={i}>
              <Link href={`/browse?tag=${query}`}>
                <a>
                  <Button
                    size="big"
                    basic={!tagMatch}
                    color={tagMatch ? 'blue' : 'black'}
                  >
                    {text}
                  </Button>
                </a>  
              </Link>
            </StyledTag>
          );
        })}
      </ul>
    </StyledList>
  );
};

export default TagsMenu;
