"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import data from "@/components/header.json";
import "./index.css";

export const HeaderContext = createContext({});

export function useHeader() {
  return useContext(HeaderContext) as {
    prevHeight: number;
    setPrevHeight: React.Dispatch<React.SetStateAction<number>>;
    state: number;
    height: number;
    currentIndex: number;
    isMobile: boolean;
    setState: React.Dispatch<React.SetStateAction<number>>;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    setHeight: React.Dispatch<React.SetStateAction<number>>;
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

enum States {
  Close,
  ShowMenu,
  ShowSubMenu,
}

function getHeight(item: any) {
  return item.length > 0 ? (item[0]?.items?.length || 0) * 3 + 7 : 0;
}

const states = ["", "open-menu", "open-sub-menu"];

const FuckingHeader = () => {
  const [state, setState] = useState(States.Close);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(0);
  const [prevHeight, setPrevHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", () => onResize());
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobile && state > 0) document.body.style.position = "fixed";
    else document.body.style.position = "initial";
  }, [isMobile, state]);

  function onResize() {
    const width = window.innerWidth;
    if (width < 768) setIsMobile(true);
    else setIsMobile(false);
  }

  return (
    <HeaderContext.Provider
      value={{
        state,
        currentIndex,
        height,
        isMobile,
        prevHeight,
        setState,
        setCurrentIndex,
        setHeight,
        setPrevHeight,
      }}
    >
      <TheHeader />
    </HeaderContext.Provider>
  );
};

export default FuckingHeader;
const TheHeader = function () {
  const { setState, state, isMobile, prevHeight } = useHeader();

  function onMouseLeave() {
    if (isMobile) return;
    setState(States.Close);
  }

  function toggleButtonClick() {
    if (!isMobile) return;
    setState((state) => (state > 0 ? 0 : 1));
  }

  return (
    <header
      style={{ "--prev-height": `${prevHeight}rem` } as React.CSSProperties}
      dir="ltr"
      className={`${states[state]} global-header fixed left-0 right-0 top-0 z-50 flex overflow-hidden bg-neutral-950/80 font-kalameh font-medium backdrop-blur md:h-11 md:overflow-visible`}
      onMouseLeave={onMouseLeave}
    >
      <ul
        dir="rtl"
        className="container mx-auto flex w-full justify-between gap-2 px-5 text-xs sm:px-0 md:max-h-[2.8rem] md:items-center"
      >
        <li className="relative z-40 flex h-11 items-center">Any</li>
        <li className="menu">
          {data.map((item, index) => (
            <TheFuckingMenu
              key={item.name}
              index={index}
              name={item.name}
              child={item.child}
            />
          ))}
        </li>
        <li className="relative z-40 mr-auto flex h-11 items-center md:mr-0">
          Fucking
        </li>
        <li className="relative z-40 flex h-11 items-center">Thing</li>
        <li
          className="relative z-40 flex h-11 items-center justify-center md:hidden"
          onClick={toggleButtonClick}
        >
          {state > 0 ? "Close" : "Open"}
        </li>
      </ul>
    </header>
  );
};

type TheFuckingMenuProps = {
  child: any[];
  name: string;
  index: number;
};

function TheFuckingMenu({ name, child, index }: TheFuckingMenuProps) {
  const { setState, setCurrentIndex, setPrevHeight, isMobile, currentIndex } =
    useHeader();
  const height = getHeight(child);

  function onMouseEnter() {
    if (isMobile) return;
    if (child.length > 0) {
      setState(States.ShowSubMenu);
      setCurrentIndex(index);
    } else setState(States.Close);
  }

  function onMouseLeave() {
    setPrevHeight(height);
  }

  function onClick() {
    if (!isMobile) return;
    if (child.length > 0) {
      setState(States.ShowSubMenu);
      setCurrentIndex(index);
    } else setState(States.Close);
  }

  return (
    <div
      className="container mx-auto md:mx-0 md:w-auto"
      style={
        {
          "--menu-height": `${height}rem`,
          "--menu-number": index + 1,
        } as React.CSSProperties
      }
    >
      <div className="menu-item">
        <ul onClick={onClick} className="cursor-pointer">
          <li onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
            {name}
          </li>
          <li className="hidden"></li>
        </ul>
      </div>
      <div
        dir="ltr"
        className={`${currentIndex === index ? "open" : ""} submenu`}
      >
        <div className="group-container" dir="rtl">
          {child.map((item: any, index) => (
            <TheFuckingItemGroup
              key={item.name}
              index={index}
              items={item.items}
              name={item.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TheFuckingItemGroup({ items, name, index }: any) {
  return (
    <div
      className="items-group"
      style={{ "--group-number": index + 1 } as React.CSSProperties}
    >
      <h2
        style={{ "--item-number": 1 } as React.CSSProperties}
        className="single-item cursor-default text-sm font-light text-neutral-200"
      >
        {name}
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item: any, index: number) => (
          <TheFuckingItem item={item} key={item} index={index} />
        ))}
      </ul>
    </div>
  );
}

function TheFuckingItem({ item, index }: any) {
  return (
    <li
      className="single-item"
      style={{ "--item-number": index + 2 } as React.CSSProperties}
    >
      {item}
    </li>
  );
}