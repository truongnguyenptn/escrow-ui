'use client';

import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import ConnectButton from './ConnectButton';

const walletPublicKey = '3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy';

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Box>
      <Flex
        bg="gray.800"
        color="white"
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor="gray.900"
        align={'center'}
        position="fixed"
        left={0}
        top={0}
        right={0}
        zIndex={9}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Flex>
            <Flex
              display={{ base: 'none', md: 'flex' }}
              ml={5}
              alignItems="center"
            >
              <Link href="/">
                <Text
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  fontSize={{
                    base: 'xl',
                    md: '2xl',
                  }}
                  color="white"
                  onClick={() => {
                    window.location.href = '/';
                  }}
                >
                  Escrow
                </Text>
              </Link>
            </Flex>
          </Flex>

          <Flex
            display={{ base: 'none', md: 'flex' }}
            ml={20}
            alignItems="center"
          >
            <DesktopNav />
          </Flex>
        </Flex>
        <Flex gap="2">
          <ConnectButton />
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = 'gray.200';
  const linkHoverColor = 'white';
  const popoverContentBgColor = 'gray.800';

  return (
    <Stack direction={'row'} spacing={4} h="100%" alignItems="center">
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'lg'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: 'gray.900' }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{
            opacity: '100%',
            transform: 'translateX(0)',
          }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack bg="gray.800" p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={600} color="gray.200">
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor="gray.700"
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Collections',
    href: '/',
  },
  {
    label: 'Make escrow',
    href: '/make',
  },
];
