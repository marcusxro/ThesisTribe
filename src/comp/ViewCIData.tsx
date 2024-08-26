import React from 'react'
import { IoMdClose } from "react-icons/io";

interface propsData {
    params: string;
    closer: React.Dispatch<React.SetStateAction<string | null>>
}


const ViewCIData: React.FC<propsData> = ({ params, closer }) => {


    function getInputStringFromComputation(params: string) {
        const parser = new DOMParser();
        const toXml = parser.parseFromString(params, 'application/xhtml+xml');
        const queryResultEls = toXml.getElementsByTagName('queryresult');
        const inputString = queryResultEls.length > 0
            ? queryResultEls[0]?.getAttribute('inputstring')
            : '';
        const pods = toXml.getElementsByTagName('pod') as any;
        let imageCount = 0;
        let secondImageUrl: string | null = null;

        for (const pod of pods) {
            const subpods = pod.getElementsByTagName('subpod');
            for (const subpod of subpods) {
                const imgEl = subpod.getElementsByTagName('img')[0];
                if (imgEl) {
                    imageCount++;
                    if (imageCount === 1) {
                        secondImageUrl = imgEl.getAttribute('src');
                        break;
                    }
                }
            }
            if (secondImageUrl) break;
        }

        return (
            <div>
                {
                    inputString && <div>
                        {inputString.length > 25 ? inputString.slice(0, 24) + '...' : inputString}
                    </div>
                }
            </div>
        );
    }



    function renderXmlResult() {
        if (!params) {
            return null
        }

        const xmlString = params;
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml')




        const pods = xmlDoc.getElementsByTagName('pod')

        if (pods.length === 0) {
            return <div className='text-white'>No results found!</div>
        }
        const tips = xmlDoc.getElementsByTagName('tips')

        if (tips.length > 0) {
            const tipsText = tips[0].getAttribute('text')
            return <div>{tipsText || 'No Results Found!'}</div>
        }

        return Array.from(pods).map((pod, index) => {
            const podElement = pod as Element;
            const title = podElement.getAttribute('title');
            const subpods = podElement.getElementsByTagName('subpod');


            return (
                <div key={index}
                className="overflow-auto border-t-gray-600 border-t-[1px] my-4 pod w-full max-w-[1200px] flex flex-col gap-3 items-start justify-start">
                    <h2 className='font-semibold w-auto p-3 bg-gray-700 text-white mt-2 rounded-lg'>{title}</h2>
                    {Array.from(subpods).map((subpod, subIndex) => {
                        const subpodElement = subpod as Element;
                        const img = subpodElement.getElementsByTagName('img')[0] as HTMLImageElement;
                        const plaintext = subpodElement.getElementsByTagName('plaintext')[0];

                        return (
                            <div key={subIndex} className="subpod book mx-6 bg-gray-400 text-white rounded-lg p-3 min-h-[100px]">
                                {img && <img src={img.getAttribute('src') || ''} alt={img.getAttribute('alt') || ''} />}
                                {plaintext && <p>{plaintext.textContent}</p>}
                            </div>
                        );
                    })}
                </div>
            );
        });
    }

    return (
        <div
            className='modalPos rounded-lg overflow-hidden flex flex-col w-full h-full'
            onClick={() => { closer(null) }}>
            <div
                onClick={(e) => { e.stopPropagation() }}
                className='w-full max-w-[400px] h-full max-h-[600px] overflow-hidden book rounded-lg flex flex-col items-start z-10'>
                <div className='h-[40px] gap-3 w-full flex items-center justify-between bg-[#e6e6e6] px-3 py-5'>
                    <div
                        onClick={() => { closer(null) }}
                        className='cursor-pointer'>
                        <IoMdClose />
                    </div>
                    <div>{params && getInputStringFromComputation(params)}</div>
                </div>
                <div className='w-full h-full pt-4 bg-white px-3  flex gap-4 flex-col text-black pb-3'>
                   <div className='w-full h-full overflow-auto pb-5'>
                   {renderXmlResult()}
                   </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCIData
