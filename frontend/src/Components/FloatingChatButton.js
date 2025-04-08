import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCommentDots } from 'react-icons/fa';
import './FloatingChatButton.css';

const FloatingChatButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight / 2 });
    const [message, setMessage] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const isDragging = useRef(false);
    const buttonRef = useRef(null);
    const tooltipRef = useRef(null);
    const messageIndex = useRef(0);

    const messages = [
        'Get in touch with us!',
        'Experiencing issues? Get in touch now!',
        'Moderator online now!',
        'You have an idea that can help us improve? Please, get in touch>>',
    ];

    const hiddenPaths = ['/report', '/admin-panel/admin-report'];

    useEffect(() => {
        if (hiddenPaths.includes(location.pathname) || location.pathname.startsWith('/chat/')) {
            return; // Don't show the button on these pages
        }

        const showNextMessage = () => {
            setMessage(messages[messageIndex.current % messages.length]);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 50000); // 5 seconds display time
            messageIndex.current++;
        };

        // Show the first message after a short delay
        const initialDelay = setTimeout(showNextMessage, 20000);

        // Set up the interval to show subsequent messages after the previous one disappears
        const interval = setInterval(() => {
            if (!showTooltip) {
                showNextMessage();
            }
        }, 650000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, [location.pathname, hiddenPaths, messages, showTooltip]); // Re-run effect if the route or hidden paths change

    useEffect(() => {
        if (showTooltip && buttonRef.current && tooltipRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            if (buttonRect.right + tooltipRect.width / 2 > windowWidth) {
                tooltipRef.current.style.left = `-${tooltipRect.width + 10}px`;
                tooltipRef.current.style.right = 'auto';
            } else {
                tooltipRef.current.style.right = `-${(tooltipRect.width - buttonRect.width) / 2}px`;
                tooltipRef.current.style.left = 'auto';
            }
        }
    }, [showTooltip]);

    const handleDragStart = () => {
        isDragging.current = true;
    };

    const handleDrag = (event, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
    };

    const handleDragEnd = () => {
        isDragging.current = false;
        setPosition((prev) => ({
            x: Math.max(0, Math.min(window.innerWidth - 60, prev.x)),
            y: Math.max(0, Math.min(window.innerHeight - 60, prev.y)),
        }));
    };

    const handleChatClick = () => {
        if (!isDragging.current) {
            navigate('/report');
        }
    };

    if (hiddenPaths.includes(location.pathname) || location.pathname.startsWith('/chat/')) {
        return null;
    }

    return (
        <motion.div
            className="floating-chat-button"
            style={{ x: position.x, y: position.y }}
            drag
            dragConstraints={{
                top: 0,
                left: 0,
                right: window.innerWidth - 60,
                bottom: window.innerHeight - 60,
            }}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onClick={handleChatClick}
            ref={buttonRef}
        >
            <FaCommentDots className="chat-icon" />
            {showTooltip && (
                <div className="chat-tooltip" ref={tooltipRef}>
                    {message}
                </div>
            )}
        </motion.div>
    );
};

export default FloatingChatButton;