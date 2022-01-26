import React, { useState } from "react";
import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import Link from "next/link";
import { Button } from "@material-tailwind/react";

export default function NavbarHome() {
  const [openNavbar, setOpenNavbar] = useState(false);

  return (
    <Navbar color="lightBlue" navbar>
        <NavbarContainer>
            <NavbarWrapper>
                <NavbarBrand>Metaverse Marketplace</NavbarBrand>
                <NavbarToggler
                    color="white"
                    onClick={() => setOpenNavbar(!openNavbar)}
                    ripple="light"
                />
            </NavbarWrapper>

            <NavbarCollapse open={openNavbar}>
                <Nav>
                  <Link href="/">
                      <Button active="light" ripple="light">
                          Home
                      </Button>
                  </Link>
                  <Link href="/create-item">
                      <Button active="light" ripple="light">
                        Create Digital Asset
                      </Button>
                  </Link>
                  <Link href="/my-assets">
                      <Button active="light" ripple="light">
                        My Digital Assets
                      </Button>
                  </Link>
                </Nav>
            </NavbarCollapse>
        </NavbarContainer>
    </Navbar>
  );
}