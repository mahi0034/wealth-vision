import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot' | 'error';
}


@Component({
  standalone:true,
  selector: 'app-chatbot',
  imports:[CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styles: [`
    .error {
      align-self: center;
      background: #f8d7da;
      color: #842029;
      padding: 8px;
      margin: 4px;
      border-radius: 10px;
      font-style: italic;
    }

    .loading {
      font-style: italic;
      opacity: 0.8;
    }
   /* Floating Button */
    .chat-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      z-index: 999;
    }

    /* Chatbot Container */
    .chatbot-container {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 500px;         /* Increased width */
      height: 500px;        /* Fixed height */
      background: white;
      border: 1px solid #ccc;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .chat-window {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .user {
      align-self: flex-end;
      background: #d1e7dd;
      padding: 8px;
      margin: 4px;
      border-radius: 10px;
    }

    .bot {
      align-self: flex-start;
      background: #f8d7da;
      padding: 8px;
      margin: 4px;
      border-radius: 10px;
    }

    .chat-form {
      display: flex;
      padding: 8px;
      border-top: 1px solid #ccc;
      gap: 8px;
    }

    .chat-form input {
      flex: 1;
      padding: 6px;
    }
    `]
})
export class ChatbotComponent {
  userInput: string = '';
  messages: ChatMessage[] = [];
  isChatOpen: boolean = false;
  isLoading: boolean = false;

  private readonly API_URL = 'https://d6kh63t1w5.execute-api.us-east-1.amazonaws.com/default/chatlambda'; // Replace this with your endpoint

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput) return;

    // Add user message
    this.messages.push({ text: trimmedInput, sender: 'user' });
    const userMessage = trimmedInput;
    this.userInput = '';
    this.isLoading = true;

    // Call API
    this.http.post<any>(this.API_URL, { query: userMessage }).subscribe({
      next: (res) => {
        this.messages.push({ text: res.answer, sender: 'bot' });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ text: 'Error getting response.', sender: 'error' });
        this.isLoading = false;
      }
    });
  }
}