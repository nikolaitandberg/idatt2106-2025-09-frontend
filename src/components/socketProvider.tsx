"use client";

import { WS_BASE_URL } from "@/types/constants";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useSession } from "next-auth/react";

interface WebSocketSubscription<T> {
  topic: string;
  callback: (message: T) => void;
  subscription: { unsubscribe: () => void } | null;
}

interface SocketContext {
  subscribe: <T>(topic: string, callback: (message: T) => void) => WebSocketSubscription<T> | null;
}

const SocketContext = createContext<SocketContext | null>(null);

export function SocketProvider({ children }: Readonly<{ children: ReactNode }>) {
  const session = useSession();
  const socketRef = useRef<Client | null>(null);
  const subscriptions = useRef<WebSocketSubscription<unknown>[]>([]);
  const queuedSubscriptionsRef = useRef<WebSocketSubscription<unknown>[]>([]);

  const createSocket = useCallback(() => {
    socketRef.current = new Client({
      brokerURL: session.data?.token ? `${WS_BASE_URL}?token=${session.data.token}` : WS_BASE_URL,
      debug: console.log,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Re-subscribe existing subscriptions
        const newSubscriptions = subscriptions.current.map(({ topic, callback }) => {
          const subscription = socketRef.current?.subscribe(topic, (message) => {
            if (message.body) callback(JSON.parse(message.body));
          });
          return { topic, callback, subscription } as WebSocketSubscription<unknown>;
        });

        // Subscribe queued subscriptions from ref
        queuedSubscriptionsRef.current.forEach(({ topic, callback }) => {
          const subscription = socketRef.current?.subscribe(topic, (message) => {
            if (message.body) callback(JSON.parse(message.body));
          });
          newSubscriptions.push({ topic, callback, subscription } as WebSocketSubscription<unknown>);
        });

        // Clear queued subscriptions
        queuedSubscriptionsRef.current = [];
        subscriptions.current = newSubscriptions;
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      onStompError: (frame) => {
        console.log("Broker reported error:", frame.headers["message"]);
        console.log("Additional details:", frame.body);
      },
    });
    socketRef.current.activate();

    return socketRef.current;
  }, [session.data]);

  useEffect(() => {
    if (session.status === "loading") return;

    if (socketRef.current?.active) {
      socketRef.current.deactivate();
    }
    createSocket();
  }, [session.status, createSocket]);

  const subscribe = useCallback(<T,>(topic: string, callback: (data: T) => void) => {
    if (!socketRef.current?.connected) {
      queuedSubscriptionsRef.current.push({ topic, callback, subscription: null } as WebSocketSubscription<unknown>);
      return null;
    }

    const subscription = socketRef.current.subscribe(topic, (message) => {
      if (message.body) callback(JSON.parse(message.body));
    });

    const webSocketSubscription = { topic, callback, subscription } as WebSocketSubscription<unknown>;
    subscriptions.current.push(webSocketSubscription);

    return webSocketSubscription;
  }, []);

  const contextValue = useMemo(
    () => ({
      subscribe: <T,>(topic: string, callback: (data: T) => void) => subscribe(topic, callback),
    }),
    [subscribe],
  );

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
}

export default function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
