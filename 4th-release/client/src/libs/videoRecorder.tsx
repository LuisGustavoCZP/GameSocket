import { Socket } from 'socket.io-client';
import { IMatchSetup } from '../models';
import { waitFor } from '.';
import React, { useEffect, useState, Component } from 'react';

const videoMime = 'video/webm;codecs=opus,vp9';

interface IVideo 
{
	mediaSource : MediaSource
	sourceBuffer : SourceBuffer
	arrayOfBlobs : ArrayBuffer[]
}

class VideoStreamer 
{
	public playerVideos: React.RefObject<HTMLVideoElement>[];
	private playerMedias: IVideo[];
	private socket : Socket;

	constructor (socket : Socket)
	{
		this.playerVideos = [];
		this.playerMedias = [];
		this.socket = socket;
	}

	public start ()
	{
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then(stream => 
		{
			console.log('Camera conectada', stream);
			this.recordMedia(stream);
		});
	}

	public createVideos (isUser : boolean) : JSX.Element
	{
		const videoRef = React.createRef<HTMLVideoElement>();
		this.playerVideos.push(videoRef);
		if(isUser) return (<video className='flex shrink w-5/12 aspect-video' muted autoPlay ref={videoRef}></video>);
		else return (<video className='flex shrink w-5/12' autoPlay ref={videoRef}></video>);
	}

	public receiveMedia (data : any, matchSetup : IMatchSetup)
	{
		this.playerVideos.forEach((playerVideo, index) => 
		{
			const player = matchSetup.players[index];
			if(player && data.id == player.socket)
			{
				const video = playerVideo.current as HTMLVideoElement;
				const playerMedia = this.playerMedias[index];
					
				if(playerMedia.mediaSource.readyState == 'open')
				{
					playerMedia.arrayOfBlobs.push(data.imageSrc);
					this.appendToSourceBuffer(video, playerMedia.sourceBuffer, playerMedia.mediaSource, playerMedia.arrayOfBlobs);
				}
			}
		});
	}

	public createMediaToVideos ()
	{
		this.playerVideos.forEach((playerVideo) => 
		{
			const video = playerVideo.current as HTMLVideoElement;
			const mediaSource = new MediaSource();
			const url = URL.createObjectURL(mediaSource);
			
			mediaSource.addEventListener('sourceopen', () =>
			{
				const sourceBuffer = mediaSource.addSourceBuffer(videoMime);
				//sourceBuffer.mode = 'sequence';
				const arrayOfBlobs : ArrayBuffer[] = [];
				sourceBuffer.addEventListener('updateend', () => 
				{
					//mediaSource.endOfStream();
					video.currentTime = 0;
					//appendToSourceBuffer(video, sourceBuffer, mediaSource, arrayOfBlobs);
				});
				
				this.playerMedias.push({mediaSource:mediaSource, sourceBuffer:sourceBuffer, arrayOfBlobs:arrayOfBlobs});
			});

			video.src = url;
			video.play();
		});
	}

	public appendToSourceBuffer(video : HTMLVideoElement, sourceBuffer : SourceBuffer, mediaSource : MediaSource, arrayOfBlobs : ArrayBuffer[])
	{
		console.log('Buffer', arrayOfBlobs);
		//console.log('Active buffers', mediaSource.activeSourceBuffers);
		//const t = video.currentTime;
		//if(arrayOfBlobs.length == 0) return;
		if (
			mediaSource.readyState === 'open' &&
			sourceBuffer &&
			sourceBuffer.updating === false
		)
		{
			const buffer = arrayOfBlobs.shift();
			if(!buffer) return;
			
			//console.log('Buffering', sourceBuffer.buffered, buffer);
			sourceBuffer.appendBuffer(buffer);
		}
		
		//console.log('Buffer', arrayOfBlobs);
		// Limit the total buffer size to 20 minutes
		// This way we don't run out of RAM
		if (
			video.buffered.length &&
			video.buffered.end(0) - video.buffered.start(0) > 1200
		)
		{
			sourceBuffer.remove(0, video.buffered.end(0) - 1200);
		}

		//video.currentTime = t;
	}

	public async recordMedia (stream : MediaStream)
	{
		const options = {
			mimeType: videoMime
		};
		const mediaRecorder = new MediaRecorder(stream, options);
		const chunks : Blob[] = [];
		mediaRecorder.onstart = function(e) 
		{
			console.log('Camera iniciada');
		};
        
		mediaRecorder.ondataavailable = (e) => 
		{
			chunks.push(e.data);
		};
        
		mediaRecorder.onstop = (e) =>
		{
			const blob = new Blob(chunks, { 'type' : videoMime });
			this.socket.emit('video-send' as any, blob);
			chunks.splice(0);
            
			this.recordMedia(stream);
		};
    
		mediaRecorder.start();
		await waitFor(2000);
		mediaRecorder.stop();
	}
}

export {VideoStreamer};
