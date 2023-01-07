import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
// Add useState import to top of file

import { useState, useEffect } from 'react';

const Home = () => {
  // Don't retry more than 20 times

  const maxRetries = 20;

const [input, setInput] = useState('');

const [img, setImg] = useState('');

const [retry, setRetry] = useState(0);

const [retryCount, setRetryCount] = useState(maxRetries);

// Add isGenerating state

const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');
  // rest of code
  // Add this function

  const onChange = (event) => {

    setInput(event.target.value);

  };
  const generateAction = async () => {

    console.log('Generating...');

    if (isGenerating && retry === 0) return;

    setIsGenerating(true);

    if (retry > 0) {

      setRetryCount((prevState) => {

        if (prevState === 0) {

          return 0;

        } else {

          return prevState - 1;

        }

      });

      setRetry(0);

    }

    const response = await fetch('/api/generate', {

      method: 'POST',

      headers: {

        'Content-Type': 'image/jpeg',

      },

      body: JSON.stringify({ input }),

    });

    const data = await response.json();

    if (response.status === 503) {

      setRetry(data.estimated_time);

      return;

    }

    if (response.ok) {

    const buffer = await response.buffer();

    // Convert to base64

    const base64 = bufferToBase64(buffer);

    // Make sure to change to base64

    res.status(200).json({ image: base64 });

  } else if (response.status === 503) {

    const json = await response.json();

    res.status(503).json(json);

  } else {

    const json = await response.json();

    res.status(response.status).json({ error: response.statusText });

  }
 
    const finalInput = input.replace(/raza/gi, 'abraza');

const response = await fetch('/api/generate', {

  method: 'POST',

  headers: {

    'Content-Type': 'image/jpeg',

  },

  body: JSON.stringify({ input: finalInput }),

});
};

    // Set final prompt here

    setFinalPrompt(input);

    // Remove content from input box

    setInput('');

    setImg(data.image);

    setIsGenerating(false);

  };
  const sleep = (ms) => {

  return new Promise((resolve) => {

    setTimeout(resolve, ms);

  });

};
  
  useEffect(() => {

    const runRetry = async () => {

      if (retryCount === 0) {

        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);

        setRetryCount(maxRetries);

        return;

        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();

    };

    if (retry === 0) {

      return;

    }

    runRetry();

  }, [retry]);
  return (

    <div className="root">

  <Head>

    <title>Silly picture generator | buildspace</title>

  </Head>

  <div className="container">

    <div className="header">

      <div className="header-title">

        <h1>Silly picture generator</h1>

      </div>

      <div className="header-subtitle">

        <h2>

          Turn me into anyone you want! Make sure you refer to me as "abraza" in the prompt

        </h2>

      </div>

      <div className="prompt-container">

        <input className="prompt-box" value={input} onChange={onChange} />

        <div className="prompt-buttons">

          <a

            className={

              isGenerating ? 'generate-button loading' : 'generate-button'

            }

            onClick={generateAction}

          >

            <div className="generate">

              {isGenerating ? (

                <span className="loader"></span>

              ) : (

                <p>Generate</p>

              )}

            </div>

          </a>

        </div>

      </div>

    </div>

    {/* Add output container */}

    {img && (
  <div className="output-content">
    <Image src={img} width={512} height={512} alt={finalPrompt} />
    {/* Add prompt here */}
    <p>{finalPrompt}</p>
  </div>
)}

  </div>

  <div className="badge-container grow">

    <a

      href="https://buildspace.so/builds/ai-avatar"

      target="_blank"

      rel="noreferrer"

    >

      <div className="badge">

        <Image src={buildspaceLogo} alt="buildspace logo" />

        <p>build with buildspace</p>

      </div>

    </a>

  </div>

</div>

  );

};
