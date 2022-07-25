import { Socket } from 'socket.io-client';
import React from 'react';

class VideoStreamer 
{
	public views : React.RefObject<HTMLImageElement>[];
	private video : HTMLVideoElement;
	private canvas : HTMLCanvasElement;
	private context : CanvasRenderingContext2D;
	private socket : Socket;
	public scale : number;

	public constructor (socket : Socket, scale = 1)
	{
		this.scale = scale;
		this.socket = socket;
		this.views = [];
		this.video = document.createElement('video');
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

		
		//console.log('Criando', this.video);
	}
    
	public start ()
	{
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then((stream) => 
		{
			this.loadCamera(stream);
		}).catch(this.loadFail);

		
	}

	public createViews (isUser : boolean) : JSX.Element
	{
		const imageRef = React.createRef<HTMLImageElement>();
		this.views.push(imageRef);
		if(isUser) return (<img className='flex shrink w-5/12' ref={imageRef}></img>);
		else return (<img className='flex shrink w-5/12' ref={imageRef}></img>);
	}

	public render (index : number, image : string)
	{
		const img = this.views[index]?.current;
		if(img) img.src = image;
	}

	private loadCamera(stream : MediaStream)
	{
		this.video.width = 400;
		this.video.height = 300;
		this.video.onplay = () => 
		{
			this.draw();
		};
		this.video.onloadedmetadata = () => 
		{
			const s = this.scale;        
			this.canvas.width = Math.ceil(this.video.width * s);
			this.canvas.height = Math.ceil(this.video.height * s);
			this.video.muted = true;
			this.video.play();
		};
		try 
		{
			this.video.srcObject = stream;
		}
		catch (error) 
		{
			this.video.src = URL.createObjectURL(stream as any);
		}

		console.log('Camera connected');
	}
  
	private loadFail()
	{
		console.log('Camera not connected');
	}

	public draw()
	{	
		this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

		//this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
		//URL.createObjectURL()
		const d = this.canvas.toDataURL('image/webp');
		
		//console.log('Desenhando', d);
		this.socket.emit('video-send', d);

		setTimeout(() =>
		{
			this.draw();
		}, 0.1);
	}
}

export {VideoStreamer};