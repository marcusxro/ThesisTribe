import React from 'react';
import { IoMdClose } from "react-icons/io";

interface Author {
    name: string;
    affiliation?: string;
    family: string;
    given: string;
    sequence: string;
}

interface ResponseObject {
    best_oa_location: any;
    data_standard: number;
    doi: string;
    doi_url: string;
    first_oa_location: any;
    genre: string;
    has_repository_copy: boolean;
    is_oa: boolean;
    is_paratext: boolean;
    journal_is_in_doaj: boolean;
    journal_is_oa: boolean;
    journal_issn_l: string;
    journal_issns: string;
    journal_name: string;
    oa_locations: any[];
    oa_locations_embargoed: any[];
    oa_status: string;
    publisher: string;
    title: string;
    updated: string;
    year: number;
    z_authors: Author[];
}

interface propsType {
    closer: React.Dispatch<React.SetStateAction<boolean>>;
    citeDetails: ResponseObject;
}

const CiteComp: React.FC<propsType> = ({ closer, citeDetails }) => {

    const {
        doi,
        doi_url,
        title,
        publisher,
        year,
        journal_name,
        z_authors,
        genre
    } = citeDetails;

    // Format authors
    function formatAuthors(authors: Author[] | null): string {
        if (!authors || authors.length === 0) {
            return "";
        }
    
        return authors.map(author => {
            const { family, given } = author;
            return `${given ? given + ' ' : ''}${family}`;
        }).join(", ");
    }
    
    // APA Citation
    const apaCitation = () => {
        return `${year}. <i>${title}</i>. By ${formatAuthors(z_authors)}. ${publisher}. <a href="${doi_url}">${doi_url}</a>`;
    };

    // MLA Citation
    const mlaCitation = () => {
        return `<i>${title}</i>. By ${formatAuthors(z_authors)}. ([Hamden, Conn.:] Archon Books. ${year}. Pp. xx, 411. $12.00.)." ${journal_name}, vol. 1, no. 1, ${year}, pp. 1-10. ${publisher}. <a href="${doi_url}">${doi_url}</a>.`;
    };

    // Chicago Citation
    const chicagoCitation = () => {
        return `<i>${title}</i>. By ${formatAuthors(z_authors)}. ([Hamden, Conn.:] Archon Books. ${year}. Pp. xx, 411. $12.00.)." ${journal_name} (${year}): 1-10. ${publisher}. <a href="${doi_url}">${doi_url}</a>`;
    };

    return (
        <div
            onClick={() => { closer(false) }}
            className='modalPos'>
            <div
                onClick={(e) => { e.stopPropagation() }}
                className='w-full max-w-[400px] h-full max-h-[600px] overflow-auto book rounded-lg flex flex-col items-start z-10'>
                <div className='h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3'>
                    <div
                        onClick={() => { closer(false) }}
                        className='cursor-pointer'>
                        <IoMdClose />
                    </div>
                    <div>Generated Cite</div>
                </div>
                <div className='w-full h-full pt-4 bg-white px-3 overflow-auto flex gap-4 flex-col text-black pb-3'>
                    <div>
                        <h4 className='font-semibold'>APA</h4>
                        <p dangerouslySetInnerHTML={{ __html: apaCitation() }} />
                    </div>
                    <div>
                        <h4 className='font-semibold'>MLA</h4>
                        <p dangerouslySetInnerHTML={{ __html: mlaCitation() }} />
                    </div>
                    <div>
                        <h4 className='font-semibold'>Chicago</h4>
                        <p dangerouslySetInnerHTML={{ __html: chicagoCitation() }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CiteComp;
