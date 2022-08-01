import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormControl, FormLabel } from '../../components/controls/FormControl';
import { useAuth } from '../../components/hooks/useAuth';
import { useProgress } from '../../components/hooks/useProgress';
import { CenterColumn } from '../../components/layout/Column';
import { SearchResult } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { searchReader } from '../../repository/reader';

export function SearchReaderPage() {

  const { passport } = useAuth();
  const [ searchResult, setSearchResult ] = useState<SearchResult>();

  const {
    progress,
    startProgress,
    stopProgress
  } = useProgress();

  const handleSearch = (kw: string) => {
    if (!passport) {
      return;
    }

    startProgress();
    console.log(kw);
    searchReader(passport.token, kw)
      .then(result => {
        setSearchResult(result);
      })
      .catch((err: ResponseError) => {
        if (err.statusCode == 404) {
          setSearchResult({
            vip: false,
          });
        }
        toast.error(err.message);
      })
      .finally(() => {
        stopProgress();
      });
  };

  return (
    <SearchReaderScreen
      submitting={progress}
      onSubmit={handleSearch}
      searchResult={searchResult}
    />
  );
}

function SearchReaderScreen(
  props: {
    submitting: boolean;
    onSubmit: (kw: string) => void;
    searchResult?: SearchResult;
  }
) {
  return (
    <CenterColumn>
      <>
        <SearchBox
          submitting={props.submitting}
          onSubmit={props.onSubmit}
        />

        {
          props.searchResult &&

          <SearchDetails
            result={props.searchResult}
          />
        }
      </>
    </CenterColumn>
  );
}

function SearchBox(
  props: {
    submitting: boolean;
    onSubmit: (keyword: string) => void;
  }
) {
  const [keyword, setKeyword] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit(keyword);
  }

  const disabled = props.submitting || !keyword;

  return (
    <form onSubmit={handleSubmit}>
      <FormLabel
        htmlFor='keyword'
      >
        Find a user
      </FormLabel>
      <div className='input-group'>
        <FormControl
          id='keyword'
          type='text'
          name='keyword'
          placeholder='Email or wechat nickname'
          onChange={handleChange}
        />
        <Button
          type='submit'
          disabled={disabled}
        >
          Search
        </Button>
      </div>
    </form>
  )
}

function SearchDetails(
  props: {
    result: SearchResult;
  }
) {

  if (props.result.ftcId) {
    return (
      <div>
        <Link to={`ftc/${props.result.ftcId}`}>
          {props.result.email}
        </Link>
      </div>
    );
  }

  if (props.result.unionId) {
    return (
      <div>
        <Link to={`wx/${props.result.unionId}`}>
          {props.result.nickname}
        </Link>
      </div>
    );
  }

  return <p>Not found</p>;
}
