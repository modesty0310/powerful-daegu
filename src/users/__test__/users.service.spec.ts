import { MailerService } from '@nestjs-modules/mailer';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from 'src/email/email.service';
import { UploadService } from 'src/upload/upload.service';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';

class MockRepository {
  DB = [
    {email: 'a@a.com', nickname: 'aaaa', password: 1234, term: true, user_type: 'origin'}
  ]

  existsByEmail(email: string) {
    const users = this.DB.filter(el => el.email === email);    
    
    if(users.length) return users[0];
    return null
  }

  createUser({email, nickname, password, term, user_type}) {
    this.DB.push({email, nickname, password, term, user_type});
    return {email, nickname, password, term, user_type}
  }

}

class MockMailService {
  sendAuthCode(email: string, code: string) {
    return;
  }
}

class MockUploadService {

}

enum UserType {
  origin = "origin", 
  naver = "naver", 
  google = "google", 
  kakao = "kakao"
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: MockRepository
        },
        {
          provide: EmailService,
          useClass: MockMailService
        },
        {
          provide:UploadService,
          useClass: MockUploadService
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('유저 생성하기', () => {
    it('이메일이 존재 하는 경우', async () => {
      try {
        await service.createUser({email: 'a@a.com', nickname: 'aaaa', password: '1234', term: true, user_type: UserType.origin});
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('회원 등록 확인', async () => {
      const {password, ...result} = await service.createUser({email: 'b@b.com', nickname: 'bbbb', password: '1234', term: true, user_type: UserType.origin});
      expect(result).toStrictEqual({email: 'b@b.com', nickname: 'bbbb', term: true, user_type: UserType.origin});
    })
  })

  describe('이메일 인증 코드 생성', () => {
    it('이메일이 존재 하는 경우', async () => {
      try {
        await service.createAuthCode({email: 'a@a.com'});
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('코드 생성 확인', async () => {
      const {code, ...result} = await service.createAuthCode({email: 'c@c.com'});
      expect(code).toHaveLength(6);
      expect(result).toStrictEqual({text: '작성한 이메일로 인증 코드를 보냈습니다.', success: true})
    })
  })

  describe('비밀 번호 변경', () => {
    it('비밀 번호가 일치 하지 않을 경우', async () => {
      try {
        await service.changePassword({email: })
      } catch (error) {
        
      }
    })
  })
});
