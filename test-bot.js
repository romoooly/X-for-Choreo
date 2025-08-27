/**
 * Test script for Gemini Telegram Bot
 * Run this to verify your configuration before deployment
 */

const fs = require('fs');
const path = require('path');

// Check if .env file exists
if (!fs.existsSync('.env')) {
    console.log('❌ .env file not found!');
    console.log('Please copy .env.example to .env and fill in your API keys');
    process.exit(1);
}

// Load environment variables
require('dotenv').config();

// Test configuration
console.log('🔍 Testing bot configuration...\n');

// Check Gemini API key
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
    console.log('❌ GEMINI_API_KEY not configured');
} else {
    console.log('✅ GEMINI_API_KEY configured');
}

// Check Telegram bot token
if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === 'your-telegram-bot-token-here') {
    console.log('❌ TELEGRAM_BOT_TOKEN not configured');
} else {
    console.log('✅ TELEGRAM_BOT_TOKEN configured');
}

// Check debug mode
if (process.env.DEBUG === 'true') {
    console.log('✅ Debug mode enabled');
} else {
    console.log('ℹ️  Debug mode disabled');
}

// Test Gemini API connection
async function testGeminiAPI() {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
        console.log('\n⚠️  Skipping Gemini API test (no API key)');
        return;
    }

    console.log('\n🧪 Testing Gemini API connection...');
    
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello, this is a test message. Please respond with "Test successful!"'
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 50,
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                console.log('✅ Gemini API test successful!');
                console.log(`   Response: ${data.candidates[0].content.parts[0].text}`);
            } else {
                console.log('⚠️  Gemini API responded but with unexpected format');
            }
        } else {
            console.log(`❌ Gemini API test failed: ${response.status}`);
            const errorText = await response.text();
            console.log(`   Error: ${errorText}`);
        }
    } catch (error) {
        console.log(`❌ Gemini API test failed: ${error.message}`);
    }
}

// Test Telegram bot token
async function testTelegramBot() {
    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === 'your-telegram-bot-token-here') {
        console.log('\n⚠️  Skipping Telegram bot test (no bot token)');
        return;
    }

    console.log('\n🧪 Testing Telegram bot token...');
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.ok && data.result) {
                console.log('✅ Telegram bot test successful!');
                console.log(`   Bot name: ${data.result.first_name}`);
                console.log(`   Username: @${data.result.username}`);
                console.log(`   Bot ID: ${data.result.id}`);
            } else {
                console.log('⚠️  Telegram API responded but with unexpected format');
            }
        } else {
            console.log(`❌ Telegram bot test failed: ${response.status}`);
            const errorText = await response.text();
            console.log(`   Error: ${errorText}`);
        }
    } catch (error) {
        console.log(`❌ Telegram bot test failed: ${error.message}`);
    }
}

// Run tests
async function runTests() {
    await testGeminiAPI();
    await testTelegramBot();
    
    console.log('\n📋 Configuration Summary:');
    console.log('========================');
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
        console.log('✅ Gemini API: Ready');
    } else {
        console.log('❌ Gemini API: Not configured');
    }
    
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your-telegram-bot-token-here') {
        console.log('✅ Telegram Bot: Ready');
    } else {
        console.log('❌ Telegram Bot: Not configured');
    }
    
    console.log('\n🚀 If all tests pass, you can deploy with:');
    console.log('   npm run deploy');
    console.log('   or');
    console.log('   ./deploy.sh');
}

// Check if running in Node.js environment that supports fetch
if (typeof fetch === 'undefined') {
    console.log('⚠️  Fetch not available in this Node.js version');
    console.log('   Please use Node.js 18+ or install node-fetch');
    console.log('\n📋 Configuration Summary:');
    console.log('========================');
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
        console.log('✅ Gemini API: Configured');
    } else {
        console.log('❌ Gemini API: Not configured');
    }
    
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your-telegram-bot-token-here') {
        console.log('✅ Telegram Bot: Configured');
    } else {
        console.log('❌ Telegram Bot: Not configured');
    }
} else {
    runTests();
}