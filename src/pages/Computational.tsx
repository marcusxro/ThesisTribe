import React, { FormEvent, useEffect, useState } from 'react'
import Header from '../comp/Header'
import { CiSearch } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import LoadingSvg from '../comp/LoadingSvg';
import IsUser from '../comp/IsUser';
import SignInModal from '../comp/SignInModal';
import SaveResultFromCom from '../comp/SaveResultFromCom';

const Computational: React.FC = () => {
  const [user] = IsUser()
  const [stringVal, setStringVal] = useState<string>("")
  const [dataRes, setDataRes] = useState<any>(null)
  const [notParsed, setNotParsed] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)


  const errorModal = (textStag: string) => {
    toast.error(`${textStag}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  }
  function submitSearch(e: FormEvent) {
    e.preventDefault()

    if (stringVal === '') {
      return errorModal('Please type something..')
    }
    setLoading(true)

    axios.get(`https://corsproxy.io/?http://api.wolframalpha.com/v2/query?appid=${process.env.REACT_APP_CI_KEY}&input=${encodeURIComponent(stringVal)}`)
      .then((res) => {
        console.log(res.data)
        if (res.status === 200) {
          setStringVal('')
          const xmlString = res.data;
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(xmlString, 'application/xml')
          setDataRes(xmlDoc)
          setNotParsed(res.data)
          setLoading(false)
          console.log('Parsed XML:', xmlDoc); // Log parsed XML

        }
      }).catch((err) => {
        console.log(err)
        errorModal("There's some error, please try again later.")
      })
  }


  function renderXmlResult() {
    if (!dataRes) {
      return null
    }
    const pods = dataRes.getElementsByTagName('pod')
    
    if (pods.length === 0) {
      return <div className='text-white'>No results found!</div>
    }
    const tips = dataRes.getElementsByTagName('tips')

    if (tips.length > 0) {
      const tipsText = tips[0].getAttribute('text')
      return <div>{tipsText || 'No Results Found!'}</div>
    }

    return Array.from(pods).map((pod, index) => {
      const podElement = pod as Element;
      const title = podElement.getAttribute('title');
      const subpods = podElement.getElementsByTagName('subpod');


      return (
        <div key={index} className="overflow-auto border-t-gray-600 border-t-[1px] my-4 pod w-full max-w-[1200px] flex flex-col gap-3 items-start justify-start">
          <h2 className='font-semibold w-auto p-3 bg-gray-700 text-white mt-2 rounded-lg'>{title}</h2>
          {Array.from(subpods).map((subpod, subIndex) => {
            const subpodElement = subpod as Element;
            const img = subpodElement.getElementsByTagName('img')[0] as HTMLImageElement;
            const plaintext = subpodElement.getElementsByTagName('plaintext')[0];

            return (
              <div key={subIndex} className="subpod book mx-6 bg-gray-400 text-white rounded-lg p-3">
                {img && <img src={img.getAttribute('src') || ''} alt={img.getAttribute('alt') || ''} />}
                {plaintext && <p>{plaintext.textContent}</p>}
              </div>
            );
          })}
        </div>
      );
    });
  }

  const [showSaveModal, setSaveModal] = useState<boolean>(false)


  return (
    <div className='flex flex-col justify-between p-3'>
      <ToastContainer />
      {
        showSaveModal === true &&
        <>
          {
            user ?
              <div
                onClick={() => { setSaveModal(false) }}
                className='custom-pos h-[100dvh] z-[200000000] items-center flex justify-center'>
                <div
                  onClick={(e) => { e.stopPropagation() }}
                  className='w-full h-auto  max-w-[400px]'>
                  <SaveResultFromCom resultToSave={notParsed} closer={setSaveModal} />
                </div>
              </div>
              :
              <div
                onClick={() => { setSaveModal(false) }}
                className='custom-pos h-[100dvh] z-[200000000] items-center flex justify-center'>
                <div
                  onClick={(e) => { e.stopPropagation() }}
                  className='w-full max-w-[400px] h-auto'>
                  <SignInModal isDataSave={true} />
                </div>
              </div>
          }
        </>
      }
      <Header bookSee={false} inputSee={false} locString='Computation' />

      <div className='h-full min-h-[50vh] mt-[80px] flex items-center justify-center flex-col gap-1 p-3'>
        <form
          onSubmit={submitSearch}
          className='w-full max-w-[700px]'
          action="submit">
          <h1 className='text-[#292929] text-[2rem] font-bold text-center lg:text-[2.5rem]'> COMPUTATIONAL INTELLIGENCE</h1>
          <h3 className='text-[#292929] text-md font-medium text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum libero harum tempore quae nihil molestias.</h3>
          <div className='relative w-full mt-2'>
            <div className='positioner'>
              <CiSearch />
            </div>
            <input
              value={stringVal}
              onChange={(e) => { setStringVal(e.target.value) }}
              className='w-full h-[50px] border-2 px-2 outline-none rounded-3xl bg-[#f9f9f9] pl-8 relative z-0'
              type="text" placeholder='Ask something...' />
          </div>
        </form>
      </div>
      {
        dataRes != null ?
          <div className='w-full max-w-[700px] min-h-[36vh] mx-auto mb-auto'>
            {
              loading ?
                <div className='w-full h-[36vh] flex items-center justify-center bg-gray-200 rounded-lg mb-3'>
                  <div className='flex flex-col gap-1 items-start justify-start'>
                    <div className='mx-auto'>
                      <LoadingSvg />
                    </div>
                    <p className='text-[13px] text-gray-600'>Finding result based on your question</p>
                  </div>
                </div>
                :
                <div>
                  <div className='flex items-end justify-end my-2'>
                    <button
                      onClick={() => { setSaveModal(true) }}
                      className='bg-green-500 text-white rounded-lg py-1 px-3'>Save</button>
                  </div>
                  <div className='p-3  w-full h-auto bg-[#292929] rounded-lg overflow-hidden'>
                    {renderXmlResult()}
                  </div>
                </div>
            }
          </div>
          :
          <div>
            <div className='w-full h-auto grid grid-cols-2 gap-3  px-5 py-3 md:flex mb-3'>
              <div className='w-full h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col min-h-[300px]'>
                <div className='font-bold text-xl mb-3 md:text-2xl break-all'>Header one</div>
                <p className='text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, quae eius adipisci dolorum, obcaecati rem earum eaque, sequi assumenda cumque officia. Consectetur excepturi aliquam modi culpa rem aliquid at ea!</p>
                <div className='mt-auto'>
                  <button className='mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn More</button>
                </div>
              </div>
              <div className='w-full h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col min-h-[300px]'>
                <div className='font-bold text-xl mb-3 md:text-2xl break-all'>Header two</div>
                <p  className='text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, quae eius adipisci dolorum, obcaecati rem earum eaque, sequi assumenda cumque officia. Consectetur excepturi aliquam modi culpa rem aliquid at ea!</p>

                <div className='mt-auto'>
                  <button className='mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn More</button>
                </div>
              </div>
              <div 
              id='legnthen'
              className='col-span-2 w-[100%] h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col min-h-[300px]'>
                <div className='font-bold text-xl mb-3 md:text-2xl break-all'>Header three</div>
                <p  className='text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, quae eius adipisci dolorum, obcaecati rem earum eaque, sequi assumenda cumque officia. Consectetur excepturi aliquam modi culpa rem aliquid at ea!</p>

                <div className='mt-auto'>
                  <button className='mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn More</button>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-1 mb-3 mt-3'>
              <div className='text-[#292929]'>Support the Developer</div>
              <div className='flex gap-3'>
                <div
                  onClick={() => { window.open('https://github.com/marcusxro', '_blank') }}
                  className='cursor-pointer text-[#292929]'><FaGithub /></div>
                <div
                  onClick={() => { window.open('https://www.facebook.com/marcuss09', '_blank') }}
                  className='cursor-pointer text-[#292929]'><FaFacebook /></div>
                <div
                  onClick={() => { window.open('https://www.tiktok.com/@marcuxro', '_blank') }}
                  className='cursor-pointer text-[#292929]'><FaTiktok /></div>
              </div>
            </div>
          </div>
      }

    </div>
  )
}

export default Computational
