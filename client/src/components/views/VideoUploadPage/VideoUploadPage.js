import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const PrivateList = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryList = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehichles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"}
]

function VideoUploadPage() {

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onVideoTitleChange = (e)=>{
        console.log(e);
        setVideoTitle(e.currentTarget.value)
    }
    const onDescriptionChange = (e)=>{
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e)=>{
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e)=>{
        setCategory(e.currentTarget.value)
    }
    const onDrop = (file)=>{
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", file[0]);

        axios.post('/api/video/uploadfiles', formData, config)
            .then(res => {
                if(res.data.success){
                    console.log(res.data);
                    let variable = {
                        url: res.data.url,
                        fileName: res.data.fileName
                    }
                    setFilePath(res.data.url);

                    axios.post('/api/video/thumbnail', variable)
                        .then(res=>{
                            if(res.data.success){
                                console.log(res.data);
                                setDescription(res.data.fileDuration);
                                setThumbnailPath(res.data.url);
                            }else{
                                alert("썸네일 생성에 실패했습니다.");
                            }
                        })
                }else{
                    alert("비디오 업로드를 실패했습니다.");
                }
            })
    }

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{ textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit>
                <div style={{ display:'flex', justifyContent:'space-between'}}>
                    <Dropzone 
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={10000000}>
                        {({ getRootProps, getInputProps })=>(
                            <div style={{ width: '300px', height: '240px', border:'1px solid lightgray', display:'flex', alignItems: 'center', justifyContent: 'center' }}{...getRootProps()}>
                                
                            <input {...getInputProps()}/>
                            <Icon type="plus" style={{ fontSize:'3rem'}}/>
                            </div>
                        )}
                    </Dropzone>
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                        </div>
                    }
                </div>
                <br/>
                <br/>
                <label htmlFor="">Title</label>
                <Input 
                    onChange={onVideoTitleChange}
                    value={VideoTitle}
                />
                <br/>
                <br/>
                <label htmlFor="">Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br/>
                <br/>
                <select onChange={onPrivateChange}>
                    {PrivateList.map((item, index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br/><br/>
                <select onChange={onCategoryChange}>
                    {CategoryList.map((item, index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br/><br/>
                <Button type="primary" size="large" onClick>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage
